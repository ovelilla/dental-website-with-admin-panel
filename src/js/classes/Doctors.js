import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Input from "./mio/Input.js";

class Doctors {
    constructor() {
        this.doctors = [];
        this.doctor = null;

        this.values = {
            name: "",
            surname: "",
            email: "",
            phone: "",
            number: "",
        };

        this.columns = [
            { field: "id", headerName: "Id" },
            { field: "name", headerName: "Nombre" },
            { field: "surname", headerName: "Apellidos" },
            { field: "email", headerName: "Email" },
            { field: "phone", headerName: "Teléfono" },
        ];

        this.init();
    }

    async init() {
        const doctorsTable = document.querySelector("#doctors-table");
        const doctorsSearch = document.querySelector("#doctors-search");

        if (doctorsTable) {
            await this.readAllDoctors();
            this.showDoctorsTable();

            const createDoctors = document.querySelector("#doctor-create");
            createDoctors.addEventListener("click", this.handleCreateDoctor.bind(this));
        }

        if (doctorsSearch) {
            this.createSearch();
        }
    }

    async readAllDoctors() {
        const response = await api.get("/api/admin/doctors");
        if (response.status === "error") {
            return;
        }
        this.doctors = response.doctors;
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

    handleCreateDoctor() {
        this.modal = new Modal({
            title: "Crear doctor",
            content: this.createDoctorForm(),
            action: "Crear",
            actionCallback: () => this.createDoctor(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async createDoctor() {
        const response = await api.post("/api/admin/doctors", this.values);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createDoctorForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `Doctor creado!`,
            message: "El doctor ha sido creado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.addRow(response.doctor);
    }

    handleUpdateDoctor(doctor) {
        this.doctor = doctor;
        this.setValues(doctor);

        this.modal = new Modal({
            title: "Actualizar doctor",
            content: this.createDoctorForm(),
            action: "Actualizar",
            actionCallback: () => this.updateDoctor(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async updateDoctor() {
        this.patient = { id: this.doctor.id, ...this.values };

        const response = await api.put("/api/admin/doctors", this.patient);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createDoctorForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Doctor actualizado!`,
            message: "El doctor ha sido actualziado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.doctor);
    }

    async deleteDoctor(doctor) {
        const confirm = new Confirm({
            title: "¿Eliminar doctor?",
            description:
                "¿Estás seguro de eliminar esta doctor? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const data = {
            id: doctor.id,
        };

        const response = await api.delete("/api/admin/doctors", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "Doctor eliminado!",
            message: "El doctor ha sido eliminado correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(doctor);
    }

    async deleteDoctors(selectedDoctors) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedDoctors.length > 1 ? "doctores" : "doctor"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedDoctors.length > 1 ? "estos doctores" : "esta doctor"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/doctors/multiple", selectedDoctors);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${
                selectedDoctors.length > 1 ? "Doctores eliminados" : "Doctor eliminado"
            }!`,
            message: `${
                selectedDoctors.length > 1
                    ? "Los doctores han sido eliminados"
                    : "El doctor ha sido eliminado"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedDoctors);
    }

    createSearch() {
        const form = document.querySelector("#doctors-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar doctor",
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

    createDoctorForm() {
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
        form.appendChild(name.getField());

        const surname = new Input({
            label: {
                text: "Apellidos",
                for: "surname",
            },
            input: {
                type: "text",
                name: "surname",
                id: "surname",
                value: this.values ? this.values.surname : "",
            },
            error: this.errors && this.errors.surname,
            message: this.errors && this.errors.surname ? this.errors.surname : "",
            callback: (value) => {
                this.values.surname = value;
                this.errors = null;
            },
        });
        form.appendChild(surname.getField());

        const email = new Input({
            label: {
                text: "Email",
                for: "email",
            },
            input: {
                type: "email",
                name: "email",
                id: "email",
                value: this.values ? this.values.email : "",
            },
            error: this.errors && this.errors.email,
            message: this.errors && this.errors.email ? this.errors.email : "",
            callback: (value) => {
                this.values.email = value;
                this.errors = null;
            },
        });
        form.appendChild(email.getField());

        const phone = new Input({
            label: {
                text: "Teléfono",
                for: "phone",
            },
            input: {
                type: "text",
                name: "phone",
                id: "phone",
                value: this.values ? this.values.phone : "",
            },
            error: this.errors && this.errors.phone,
            message: this.errors && this.errors.phone ? this.errors.phone : "",
            callback: (value) => {
                this.values.phone = value;
                this.errors = null;
            },
        });
        form.appendChild(phone.getField());

        const number = new Input({
            label: {
                text: "Número de colegiado",
                for: "number",
            },
            input: {
                type: "text",
                name: "number",
                id: "number",
                value: this.values ? this.values.number : "",
            },
            error: this.errors && this.errors.number,
            message: this.errors && this.errors.number ? this.errors.number : "",
            callback: (value) => {
                this.values.number = value;
                this.errors = null;
            },
        });
        form.appendChild(number.getField());

        return form;
    }

    showDoctorsTable() {
        const doctorsContainer = document.querySelector("#doctors-table");

        this.table = new Table({
            columns: this.columns,
            rows: this.doctors,
            container: doctorsContainer,
            visibleRows: 10,
            rowsPerPage: 15,
            update: this.handleUpdateDoctor.bind(this),
            delete: this.deleteDoctor.bind(this),
            deleteSelected: this.deleteDoctors.bind(this),
        });
    }
}

export default Doctors;
