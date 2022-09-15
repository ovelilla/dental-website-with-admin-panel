import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Input from "./mio/Input.js";

class Treatments {
    constructor() {
        this.treatments = [];
        this.treatment = null;

        this.values = {
            name: "",
            description: "",
            price: "",
        };

        this.columns = [
            { field: "id", headerName: "Id" },
            { field: "name", headerName: "Nombre" },
            { field: "description", headerName: "Descripción" },
            { field: "price", headerName: "Precio" },
        ];

        this.init();
    }

    async init() {
        const treatmentsTable = document.querySelector("#treatments-table");
        const treatmentsSearch = document.querySelector("#treatments-search");

        if (treatmentsTable) {
            await this.readAllTreatments();
            this.showTreatmentsTable();

            const createTreatments = document.querySelector("#treatment-create");
            createTreatments.addEventListener("click", this.handleCreateTreatment.bind(this));
        }

        if (treatmentsSearch) {
            this.createSearch();
        }
    }

    async readAllTreatments() {
        const response = await api.get("/api/admin/treatments");
        if (response.status === "error") {
            return;
        }
        this.treatments = response.treatments;
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

    handleCreateTreatment() {
        this.modal = new Modal({
            title: "Crear tratamiento",
            content: this.createTreatmentForm(),
            action: "Crear",
            actionCallback: () => this.createTreatment(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async createTreatment() {
        const response = await api.post("/api/admin/treatments", this.values);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createTreatmentForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `Tratamiento creado!`,
            message: "El tratamiento ha sido creado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.addRow(response.treatment);
    }

    handleUpdateTreatment(treatment) {
        this.treatment = treatment;
        this.setValues(treatment);

        this.modal = new Modal({
            title: "Actualizar tratamiento",
            content: this.createTreatmentForm(),
            action: "Actualizar",
            actionCallback: () => this.updateTreatment(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async updateTreatment() {
        this.patient = { id: this.treatment.id, ...this.values };

        const response = await api.put("/api/admin/treatments", this.patient);
        console.log(response);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createTreatmentForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Tratamiento actualizado!`,
            message: "El tratamiento ha sido actualziado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.treatment);
    }

    async deleteTreatment(treatment) {
        const confirm = new Confirm({
            title: "¿Eliminar tratamiento?",
            description:
                "¿Estás seguro de eliminar esta tratamiento? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const data = {
            id: treatment.id,
        };

        const response = await api.delete("/api/admin/treatments", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "Tratamiento eliminado!",
            message: "El tratamiento ha sido eliminado correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(treatment);
    }

    async deleteTreatments(selectedTreatments) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedTreatments.length > 1 ? "tratamientos" : "tratamiento"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedTreatments.length > 1 ? "estos tratamientos" : "esta tratamiento"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/treatments/multiple", selectedTreatments);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${
                selectedTreatments.length > 1 ? "Tratamientos eliminados" : "Tratamiento eliminado"
            }!`,
            message: `${
                selectedTreatments.length > 1
                    ? "Los tratamientos han sido eliminados"
                    : "El tratamiento ha sido eliminado"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedTreatments);
    }

    createSearch() {
        const form = document.querySelector("#treatments-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar tratamiento",
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

    createTreatmentForm() {
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

        const description = new Input({
            label: {
                text: "Descripción",
                for: "description",
            },
            input: {
                type: "text",
                name: "description",
                id: "description",
                value: this.values ? this.values.description : "",
            },
            callback: (value) => {
                this.values.description = value;
            },
        });

        const descriptionField = description.getField();
        form.appendChild(descriptionField);

        const price = new Input({
            label: {
                text: "Precio",
                for: "price",
            },
            input: {
                type: "number",
                name: "price",
                id: "price",
                step: "0.01",
                value: this.values ? this.values.price : "",
            },
            error: this.errors && this.errors.price,
            message: this.errors && this.errors.price ? this.errors.price : "",
            callback: (value) => {
                this.values.price = value;
                this.errors = null;
            },
        });

        const priceField = price.getField();
        form.appendChild(priceField);

        return form;
    }

    showTreatmentsTable() {
        const treatmentsContainer = document.querySelector("#treatments-table");

        this.table = new Table({
            columns: this.columns,
            rows: this.treatments,
            container: treatmentsContainer,
            visibleRows: 10,
            rowsPerPage: 15,
            update: this.handleUpdateTreatment.bind(this),
            delete: this.deleteTreatment.bind(this),
            deleteSelected: this.deleteTreatments.bind(this),
        });
    }
}

export default Treatments;
