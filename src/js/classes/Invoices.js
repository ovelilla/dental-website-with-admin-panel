import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Input from "./mio/Input.js";
import { icon } from "../modules/Icon.js";
class Invoices {
    constructor() {
        this.invoices = [];
        this.invoice = null;

        this.values = {
            number: "",
            created_at: "",
        };

        this.init();
    }

    async init() {
        const invoicesTable = document.querySelector("#invoices-table");
        const invoicesSearch = document.querySelector("#invoices-search");

        if (invoicesTable) {
            await this.readAllInvoices();
            this.showInvoicesTable();
        }

        if (invoicesSearch) {
            this.createSearch();
        }
    }

    async readAllInvoices() {
        const response = await api.get("/api/admin/invoices");
        console.log(response);
        if (response.status === "error") {
            return;
        }
        this.invoices = response.invoices;
    }

    setValues(values) {
        for (const key of Object.keys(values)) {
            if (this.values[key] !== undefined) {
                this.values[key] = values[key];
            }
        }
    }

    resetValues() {
        for (const key of Object.keys(this.values)) {
            this.values[key] = "";
        }
    }

    handleUpdateInvoice(invoice) {
        this.invoice = invoice;
        this.setValues(invoice);

        this.modal = new Modal({
            title: "Actualizar factura",
            content: this.createInvoiceForm(),
            action: "Actualizar",
            actionCallback: () => this.updateInvoice(),
            closeCallback: () => this.resetValues(),
        });
    }

    async updateInvoice() {
        this.invoice.number = this.values.number;
        this.invoice.created_at = this.values.created_at;

        const response = await api.put("/api/admin/invoices", this.invoice);
        console.log(response);
        // return;

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createInvoiceForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Factura actualizada!`,
            message: "La factura ha sido actualziada correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.invoice);
    }

    async deleteInvoice(invoice) {
        const confirm = new Confirm({
            title: "¿Eliminar factura?",
            description:
                "¿Estás seguro de eliminar esta factura? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const data = {
            id: invoice.id,
        };

        const response = await api.delete("/api/admin/invoices", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "Factura eliminada!",
            message: "La factura ha sido eliminada correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(invoice);
    }

    async deleteInvoices(selectedInvoices) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedInvoices.length > 1 ? "facturas" : "factura"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedInvoices.length > 1 ? "estas facturas" : "esta factura"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/invoices/multiple", selectedInvoices);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${selectedInvoices.length > 1 ? "Facturas eliminadas" : "Factura eliminada"}!`,
            message: `${
                selectedInvoices.length > 1
                    ? "Las facturas han sido eliminadas"
                    : "La factura ha sido eliminada"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedInvoices);
    }

    createSearch() {
        const form = document.querySelector("#invoices-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar factura",
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

    createInvoiceForm() {
        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;

        const number = new Input({
            label: {
                text: "Número de factura",
                for: "number",
            },
            input: {
                type: "text",
                name: "number",
                id: "number",
                value: this.values.number,
            },
            error: this.errors && this.errors.number,
            message: this.errors && this.errors.number ? this.errors.number : "",
            callback: (value) => {
                this.values.number = value;
                this.errors = null;
            },
        });
        form.appendChild(number.getField());

        const createdAt = new Input({
            label: {
                text: "Fecha de creación",
                for: "created_at",
            },
            input: {
                type: "date",
                name: "created_at",
                id: "created_at",
                value: this.values.created_at.split(" ")[0],
            },
            error: this.errors && this.errors.created_at,
            message: this.errors && this.errors.created_at ? this.errors.created_at : "",
            callback: (value) => {
                this.values.created_at = value;
                this.errors = null;
            },
        });
        form.appendChild(createdAt.getField());

        return form;
    }

    showInvoicesTable() {
        const columns = [
            { field: "id", headerName: "Id" },
            { field: "number", headerName: "Número" },
            { field: "full_patient_name", headerName: "Paciente" },
            { field: "total", headerName: "Total" },
            { field: "created_at_format", headerName: "Fecha" },
        ];

        const container = document.querySelector("#invoices-table");

        this.table = new Table({
            columns,
            rows: this.invoices,
            container,
            visibleRows: 10,
            rowsPerPage: 15,
            update: this.handleUpdateInvoice.bind(this),
            delete: this.deleteInvoice.bind(this),
            deleteSelected: this.deleteInvoices.bind(this),
            extraActions: [
                {
                    name: "Generar PDF",
                    icon: icon.get("filePDF"),
                    callback: this.generatePDF.bind(this),
                },
            ],
        });
    }

    async generatePDF(invoice) {
        const response = await api.post("/api/admin/invoices/pdf", invoice);

        const linkSource = `data:application/pdf;base64,${response.base64}`;
        const downloadLink = document.createElement("a");
        const fileName = response.fileName;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }
}

export default Invoices;
