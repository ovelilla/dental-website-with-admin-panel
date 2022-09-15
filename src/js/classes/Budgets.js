import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Autocomplete from "./Autocomplete.js";
import Budgeteds from "./Budgeteds.js";
import Input from "./mio/Input.js";
import Textarea from "./mio/Textarea.js";
import { icon } from "../modules/Icon.js";

class Budgets {
    constructor() {
        this.patients = [];
        this.budgets = [];

        this.budget = {
            patient: null,
            comment: "Este presupuesto tiene una validez de 30 días naturales y puede variar por razón de los resultados de las pruebas radiológicas.",
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
            comment: "",
            budgeteds: [],
            errors: null,
        };
    }

    async readAllBudgets() {
        const response = await api.get("/api/admin/budgets");
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

        this.table.addRow(response.budget);
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
    }

    async deleteBudget(budget) {
        const confirm = new Confirm({
            title: "¿Eliminar presupuesto?",
            description:
                "¿Estás seguro de eliminar esta presupuesto? Los datos no podrán ser recuperados.",
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
            title: `¡${
                selectedBudgets.length > 1 ? "Presupuestos eliminados" : "Presupuesto eliminado"
            }!`,
            message: `${
                selectedBudgets.length > 1
                    ? "Los presupuestos han sido eliminados"
                    : "El presupuesto ha sido eliminado"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedBudgets);
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
                value: this.budget.patient
                    ? `${this.budget.patient.name} ${this.budget.patient.surname}`
                    : "",
            },
            error: this.budget.errors && this.budget.errors.patient,
            message:
                this.budget.errors && this.budget.errors.patient ? this.budget.errors.patient : "",
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
            },
        });

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

    async generatePDF(budget) {
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
}

export default Budgets;
