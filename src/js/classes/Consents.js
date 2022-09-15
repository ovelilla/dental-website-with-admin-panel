import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Input from "./mio/Input.js";
import Textarea from "./mio/Textarea.js";

class Consents {
    constructor() {
        this.consents = [];
        this.consent = null;

        this.values = {
            name: "",
            description: "",
        };

        this.columns = [
            { field: "id", headerName: "Id" },
            { field: "name", headerName: "Nombre" },
        ];

        this.init();
    }

    async init() {
        const consentsTable = document.querySelector("#consents-table");
        const consentsSearch = document.querySelector("#consents-search");

        if (consentsTable) {
            await this.readAllConsents();
            this.showConsentsTable();

            const createConsents = document.querySelector("#consent-create");
            createConsents.addEventListener("click", this.handleCreateConsent.bind(this));
        }

        if (consentsSearch) {
            this.createSearch();
        }
    }

    async readAllConsents() {
        const response = await api.get("/api/admin/consents");
        if (response.status === "error") {
            return;
        }
        this.consents = response.consents;
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

    handleCreateConsent() {
        this.modal = new Modal({
            title: "Crear consentimiento",
            content: this.createConsentForm(),
            action: "Crear",
            maxWidth: "800px",
            actionCallback: () => this.createConsent(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async createConsent() {
        const response = await api.post("/api/admin/consents", this.values);
        console.log(response);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createConsentForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `Consentimiento creado!`,
            message: "El consentimiento ha sido creado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.addRow(response.consent);
    }

    handleUpdateConsent(consent) {
        this.consent = consent;
        this.setValues(consent);

        this.modal = new Modal({
            title: "Actualizar consentimiento",
            content: this.createConsentForm(),
            action: "Actualizar",
            maxWidth: "800px",
            actionCallback: () => this.updateConsent(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async updateConsent() {
        this.patient = { id: this.consent.id, ...this.values };

        const response = await api.put("/api/admin/consents", this.patient);
        console.log(response);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createConsentForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Consentimiento actualizado!`,
            message: "El consentimiento ha sido actualziado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.consent);
    }

    async deleteConsent(consent) {
        const confirm = new Confirm({
            title: "¿Eliminar consentimiento?",
            description:
                "¿Estás seguro de eliminar esta consentimiento? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const data = {
            id: consent.id,
        };

        const response = await api.delete("/api/admin/consents", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "Consentimiento eliminado!",
            message: "El consentimiento ha sido eliminado correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(consent);
    }

    async deleteConsents(selectedConsents) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedConsents.length > 1 ? "consentimientos" : "consentimiento"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedConsents.length > 1 ? "estos consentimientos" : "esta consentimiento"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/consents/multiple", selectedConsents);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${
                selectedConsents.length > 1 ? "Consentimientos eliminados" : "Consentimiento eliminado"
            }!`,
            message: `${
                selectedConsents.length > 1
                    ? "Los consentimientos han sido eliminados"
                    : "El consentimiento ha sido eliminado"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedConsents);
    }

    createSearch() {
        const form = document.querySelector("#consents-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar consentimiento",
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

    createConsentForm() {
        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;

        const name = new Input({
            label: {
                text: "Nombre",
                for: "name",
            },
            input: {
                type: "text",
                name: "name",
                id: "name",
                value: this.values ? this.values.name : "",
            },
            error: this.errors && this.errors.name,
            message: this.errors && this.errors.name ? this.errors.name : "",
            callback: (value) => {
                this.values.name = value;
                this.errors = null;
            },
        });

        const nameField = name.getField();
        form.appendChild(nameField);

        const description = new Textarea({
            label: {
                text: "Descripción",
                for: "description",
            },
            input: {
                name: "description",
                id: "description",
                rows: 24,
                value: this.values ? this.values.description : "",
            },
            callback: (value) => {
                this.values.description = value;
            },
        });

        const descriptionField = description.getField();
        form.appendChild(descriptionField);

        return form;
    }

    showConsentsTable() {
        const consentsContainer = document.querySelector("#consents-table");

        this.table = new Table({
            columns: this.columns,
            rows: this.consents,
            container: consentsContainer,
            visibleRows: 10,
            rowsPerPage: 15,
            update: this.handleUpdateConsent.bind(this),
            delete: this.deleteConsent.bind(this),
            deleteSelected: this.deleteConsents.bind(this),
        });
    }
}

export default Consents;
