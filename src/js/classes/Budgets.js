import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Autocomplete from "./Autocomplete.js";
import Budgeteds from "./Budgeteds.js";
import Input from "./mio/Input.js";
import Textarea from "./mio/Textarea.js";
import Signature from "./Signature.js";
import { icon } from "../modules/Icon.js";
import { dateFormat, formatCurrency } from "../helpers.js";

class Budgets {
    constructor() {
        this.patients = [];
        this.budgets = [];

        this.budget = {
            patient: null,
            comment:
                "Este presupuesto tiene una validez de 30 días naturales y puede variar por razón de los resultados de las pruebas radiológicas.",
            budgeteds: [],
            errors: null,
        };

        this.init();
    }

    async init() {
        const budgetsTable = document.querySelector("#budgets-table");
        const budgetsSearch = document.querySelector("#budgets-search");

        if (budgetsTable) {
            await this.readAllPatients();
            await this.readAllBudgets();
            this.showBudgetsTable();

            const createBudgets = document.querySelector("#budget-create");
            createBudgets.addEventListener("click", this.handleCreateBudget.bind(this));
        }

        if (budgetsSearch) {
            this.createSearch();
        }
    }

    resetBudget() {
        this.budget = {
            patient: null,
            comment:
                "Este presupuesto tiene una validez de 30 días naturales y puede variar por razón de los resultados de las pruebas radiológicas.",
            budgeteds: [],
            errors: null,
        };
    }

    async readAllBudgets() {
        const response = await api.get("/api/admin/budgets");
        console.log(response);
        if (response.status === "error") {
            return;
        }
        this.budgets = response.budgets;
    }

    async readAllPatients() {
        const response = await api.get("/api/admin/patients");
        if (response.status === "error") {
            return;
        }
        this.patients = response.patients;
    }

    async handleCreateBudget() {
        this.budgeteds = new Budgeteds({
            budgeteds: [...this.budget.budgeteds],
            callback: () => {
                this.budgeteds.repaint(this.budgeteds.getBudgeteds());
                this.modal.repaint(this.createBudgetForm());
            },
        });

        await this.budgeteds.readAllTreatments();
        this.budgeteds.show();

        this.modal = new Modal({
            title: "Crear presupuesto",
            content: this.createBudgetForm(),
            action: "Crear",
            fullscreenButton: true,
            actionCallback: () => this.createBudget(),
            closeCallback: () => {
                this.resetBudget();
            },
            maxWidth: "800px",
        });
    }

    async createBudget() {
        this.budget.budgeteds = this.budgeteds.getBudgeteds();

        const response = await api.post("/api/admin/budgets", this.budget);

        if (response.status === "error") {
            if (response.type === "budget") {
                this.budget.errors = response.errors;
            }
            if (response.type === "budgeted") {
                this.budget.budgeteds.forEach((budgeted) => {
                    response.errors.forEach((error) => {
                        if (error.id === budgeted.id) {
                            budgeted.errors = error.errors;
                        }
                    });
                });
            }
            this.budgeteds.repaint(this.budgeteds.getBudgeteds());
            this.modal.repaint(this.createBudgetForm());
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Presupuesto creado!",
            message: "El presupuesto ha sido creado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        const budgetsTable = document.querySelector("#budgets-table");

        if (budgetsTable) {
            this.table.addRowAtStart(response.budget);
        }

        this.resetBudget();
    }

    async handleUpdateBudget(budget) {
        this.budget = structuredClone(budget);

        this.budgeteds = new Budgeteds({
            budgeteds: this.budget.budgeteds,
            callback: () => {
                this.budgeteds.repaint(this.budgeteds.getBudgeteds());
                this.modal.repaint(this.createBudgetForm());
            },
        });

        await this.budgeteds.readAllTreatments();
        this.budgeteds.show();

        this.modal = new Modal({
            title: "Actualizar presupuesto",
            content: this.createBudgetForm(),
            action: "Actualizar",
            fullscreenButton: true,
            actionCallback: () => this.updateBudget(),
            closeCallback: () => {
                this.resetBudget();
            },
            maxWidth: "800px",
        });
    }

    async updateBudget() {
        this.budget.budgeteds = this.budgeteds.getBudgeteds();

        const response = await api.put("/api/admin/budgets", this.budget);

        if (response.status === "error") {
            if (response.type === "budget") {
                this.budget.errors = response.errors;
            }
            if (response.type === "budgeted") {
                this.budget.budgeteds.forEach((budgeted) => {
                    response.errors.forEach((error) => {
                        if (error.id === budgeted.id) {
                            budgeted.errors = error.errors;
                        }
                    });
                });
            }
            this.budgeteds.repaint(this.budgeteds.getBudgeteds());
            this.modal.repaint(this.createBudgetForm());
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Presupuesto actualizado!",
            message: "El presupuesto ha sido actualziado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.budget);

        this.resetBudget();
    }

    async deleteBudget(budget) {
        const confirm = new Confirm({
            title: "¿Eliminar presupuesto?",
            description: "¿Estás seguro de eliminar esta presupuesto? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/budgets", budget);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Presupuesto eliminado!",
            message: "El presupuesto ha sido eliminado correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(budget);
    }

    async deleteBudgets(selectedBudgets) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedBudgets.length > 1 ? "presupuestos" : "presupuesto"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedBudgets.length > 1 ? "estos presupuestos" : "esta presupuesto"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/budgets/multiple", selectedBudgets);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${selectedBudgets.length > 1 ? "Presupuestos eliminados" : "Presupuesto eliminado"}!`,
            message: `${
                selectedBudgets.length > 1 ? "Los presupuestos han sido eliminados" : "El presupuesto ha sido eliminado"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedBudgets);

        this.resetBudget();
    }

    createSearch() {
        const form = document.querySelector("#budgets-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar presupuesto",
                for: "search",
            },
            input: {
                type: "text",
                name: "search",
                id: "search",
            },
        });
        const searchField = search.getField();
        form.appendChild(searchField);
    }

    async handleSearch(e) {
        const search = e.target.value;
        this.table.searchRow(search);
    }

    createBudgetForm() {
        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;

        const patient = new Input({
            label: {
                text: "Paciente",
                for: "patient",
            },
            input: {
                type: "text",
                name: "patient",
                id: "patient",
                value: this.budget.patient ? `${this.budget.patient.name} ${this.budget.patient.surname}` : "",
            },
            error: this.budget.errors && this.budget.errors.patient,
            message: this.budget.errors && this.budget.errors.patient ? this.budget.errors.patient : "",
            callback: () => {
                this.budget.errors = null;
            },
        });
        const patientField = patient.getField();
        form.appendChild(patientField);

        new Autocomplete({
            target: patientField.querySelector("input"),
            data: this.patients,
            findFields: ["name", "surname"],
            showFields: ["name", "surname"],
            size: 6,
            callback: (patient) => {
                this.budget.patient = patient;
                this.budgeteds.repaint(this.budgeteds.getBudgeteds());
                this.modal.repaint(this.createBudgetForm());
            },
        });

        if (this.budget.patient) {
            const examination = new Textarea({
                label: {
                    text: "Diagnóstico",
                    for: "examination",
                },
                input: {
                    name: "examination",
                    id: "examination",
                    rows: 3,
                    value: this.budget.patient.history.examination,
                },
                callback: (value) => {
                    this.budget.patient.history.examination = value;
                },
            });
            form.appendChild(examination.getField());
        }

        const comment = new Textarea({
            label: {
                text: "Comentario",
                for: "comment",
            },
            input: {
                name: "comment",
                id: "comment",
                rows: 3,
                value: this.budget.comment,
            },
            callback: (value) => {
                this.budget.comment = value;
            },
        });
        form.appendChild(comment.getField());

        form.appendChild(this.budgeteds.getBudgetedsEl());

        return form;
    }

    showBudgetsTable() {
        const columns = [
            { field: "id", headerName: "Id" },
            { field: "full_patient_name", headerName: "Paciente" },
            { field: "total", headerName: "Total" },
            { field: "created_at", headerName: "Fecha" },
        ];

        const container = document.querySelector("#budgets-table");

        this.table = new Table({
            columns,
            rows: this.budgets,
            container,
            visibleRows: 10,
            rowsPerPage: 15,
            update: this.handleUpdateBudget.bind(this),
            delete: this.deleteBudget.bind(this),
            deleteSelected: this.deleteBudgets.bind(this),
            showActionsMenu: true,
            extraActions: [
                {
                    name: "Firmar presupuesto",
                    icon: icon.get("pen"),
                    callback: this.handleSignBudget.bind(this),
                },
                {
                    name: "Generar PDF",
                    icon: icon.get("filePDF"),
                    callback: this.generatePDF.bind(this),
                },
                {
                    name: "Crear factura",
                    icon: icon.get("fileText"),
                    callback: this.createInvoice.bind(this),
                },
            ],
        });
    }

    handleSignBudget(budget) {
        this.budget = structuredClone(budget);

        this.modal = new Modal({
            title: "Firmar presupuesto",
            customTitle: () => {
                const logo = document.createElement("img");
                logo.src = "/build/img/varios/logo-blue.png";
                logo.classList.add("custom-title");
                return logo;
            },
            content: this.createSign(),
            action: "Firmar",
            fullscreenButton: true,
            actionCallback: this.signBudget.bind(this),
            closeCallback: () => {
                this.resetBudget();
            },
            maxWidth: "800px",
        });
    }

    createSign() {
        const sign = document.createElement("div");
        sign.classList.add("budget-sign");

        const info = document.createElement("div");
        info.classList.add("info");
        sign.appendChild(info);

        const name = document.createElement("p");
        name.classList.add("name");
        name.textContent = "Paciente: ";
        info.appendChild(name);

        const nameSpan = document.createElement("span");
        nameSpan.textContent = this.budget.full_patient_name;
        name.appendChild(nameSpan);

        const date = document.createElement("p");
        date.classList.add("date");
        date.textContent = "Fecha: ";
        info.appendChild(date);

        const dateSpan = document.createElement("span");
        dateSpan.textContent = dateFormat(this.budget.created_at_original);
        date.appendChild(dateSpan);

        const hasDiscount = this.budget.budgeteds.some((budgeted) => budgeted.discount > 0);

        const table = document.createElement("table");
        table.classList.add("table");
        sign.appendChild(table);

        const columns = {
            withDiscount: ["Tratamiento", "Pieza", "Precio u.", "Dto.", "Total"],
            withoutDiscount: ["Tratamiento", "Pieza", "Precio"],
        };

        const thead = document.createElement("thead");
        table.appendChild(thead);

        const trHeader = document.createElement("tr");
        thead.appendChild(trHeader);

        columns[hasDiscount ? "withDiscount" : "withoutDiscount"].forEach((column) => {
            const th = document.createElement("th");
            th.textContent = column;
            trHeader.appendChild(th);
        });

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        this.budget.budgeteds.forEach((budgeted) => {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);

            const tdTreatment = document.createElement("td");
            tdTreatment.classList.add("w-100");
            tdTreatment.textContent = budgeted.treatment.name;
            tr.appendChild(tdTreatment);

            const tdPieces = document.createElement("td");
            tdPieces.textContent = budgeted.piece;
            tr.appendChild(tdPieces);

            if (hasDiscount) {
                const tdUnitPrice = document.createElement("td");
                tdUnitPrice.textContent = `${budgeted.unit_price} €`;
                tr.appendChild(tdUnitPrice);

                const tdDiscount = document.createElement("td");
                tdDiscount.textContent = budgeted.discount;
                tr.appendChild(tdDiscount);
            }

            const tdTotalPrice = document.createElement("td");
            tdTotalPrice.textContent = `${budgeted.total_price} €`;
            tr.appendChild(tdTotalPrice);
        });

        let subtotal = 0;
        let total = 0;

        this.budget.budgeteds.forEach((budgeted) => {
            subtotal += parseFloat(budgeted.total_price);
            total +=
                parseFloat(budgeted.total_price) -
                (parseFloat(budgeted.total_price) * parseInt(budgeted.discount)) / 100;
        });

        const tfooter = document.createElement("tfoot");
        table.appendChild(tfooter);

        const trFooter = document.createElement("tr");
        tfooter.appendChild(trFooter);

        const tdFake = document.createElement("td");
        trFooter.appendChild(tdFake);

        const tdTotal = document.createElement("td");
        tdTotal.textContent = "Total";
        tdTotal.classList.add("text-right");
        trFooter.appendChild(tdTotal);

        const tdTotalPrice = document.createElement("td");
        tdTotalPrice.textContent = formatCurrency(subtotal);
        trFooter.appendChild(tdTotalPrice);

        if (hasDiscount) {
            const tdDiscount = document.createElement("td");
            tdDiscount.textContent = "T. dto.";
            trFooter.appendChild(tdDiscount);

            const tdDiscountAmount = document.createElement("td");
            tdDiscountAmount.textContent = formatCurrency(total);
            trFooter.appendChild(tdDiscountAmount);
        }

        const signatureField = document.createElement("div");
        signatureField.classList.add("mio-field");
        sign.appendChild(signatureField);

        this.signature = new Signature({
            container: signatureField,
            title: "Firma",
            clear: true,
            signature: this.budget.signature.signature
        });

        return sign;
    }

    async signBudget() {
        const data = {
            budget_id: this.budget.id,
            patient_id: this.budget.patient_id,
            signature: this.signature.getBase64(),
        };

        const response = await api.post("/api/admin/budgets/sign", data);

        if (response.status === "error") {
            await popup.open({
                type: "error",
                title: "Error al firmar el presupuesto",
                message: response.message,
                timer: 3000,
            });
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Presupuesto firmado!",
            message: "El presupuesto ha sido firmado correctamente.",
            timer: 3000,
        });

        this.modal.close();
        this.table.updateRow(response.budget);
    }

    async generatePDF(budget) {
        console.log(budget);
        const response = await api.post("/api/admin/budgets/pdf", budget);

        const linkSource = `data:application/pdf;base64,${response.base64}`;
        const downloadLink = document.createElement("a");
        const fileName = response.fileName;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    async createInvoice(budget) {
        const response = await api.post("/api/admin/invoices", budget);

        if (response.status === "error") {
            await popup.open({
                type: "error",
                title: "Error al crear la factura",
                message: response.message,
                timer: 3000,
            });
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Factura creada!",
            message: "La factura ha sido creada correctamente.",
            timer: 3000,
        });
    }

    dateFormat() {
        const newDate = new Date(date);
        const options = {
            dateStyle: "short",
        };
        return new Intl.DateTimeFormat("es-ES", options).format(newDate);
    }

    repaint() {
        this.budgeteds.repaint();
    }
}

export default Budgets;
