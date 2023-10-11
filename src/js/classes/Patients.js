import { popup, api } from "../app.js";
import { icon } from "../modules/Icon.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Input from "./mio/Input.js";
import Select from "./mio/Select.js";
import Textarea from "./mio/Textarea.js";
import Signature from "./Signature.js";
import Switch from "./mio/Switch.js";
import Autocomplete from "./Autocomplete.js";
import History from "./History.js";
import { dateFormat } from "../helpers.js";
import { budgets } from "../app.js";
import Datepicker from "../components/datepicker";

class Patients {
    constructor() {
        this.patients = [];
        this.consents = [];
        this.doctors = [];

        this.patient = null;

        this.values = {
            name: "",
            surname: "",
            phone: "",
            email: "",
            nif: "",
            birth_date: "",
            gender: "",
            meet: "",
            insurance: "",
            address: "",
            postcode: "",
            location: "",
            province: "",
            country: "",
            reason: "",
            medication: "",
            allergies: "",
            diseases: "",
            smoker: "",
            infectious: "",
            comment: "",
            signature: "",
            active: true,
        };
        this.errors = null;

        this.columns = [
            { field: "id", headerName: "Id" },
            { field: "name", headerName: "Nombre" },
            { field: "surname", headerName: "Apellidos" },
            { field: "phone", headerName: "Telefono" },
        ];

        this.consent = {
            patient: null,
            doctor: null,
            representative: false,
            representative_name: "",
            representative_nif: "",
            consent: null,
            signature: null,
        };
        this.consentErrors = null;

        this.email = {
            subject: "Novedades en clínica dental",
            header: "¡Hola {name}...",
            body: "Hola {name}, desde Dentiny te informamos que...",
            footer: "Recibe un cordial saludo...",
        };
        this.emailErrors = null

        this.init();
    }

    async init() {
        const patientsTable = document.querySelector("#patients-table");
        const patientsSearch = document.querySelector("#patients-search");

        if (patientsTable) {
            await Promise.all([this.readAllPatients(), this.readAllConsents(), this.readAllDoctors()]);
            this.showPatientsTable();

            const createPatients = document.querySelector("#patient-create");
            createPatients.addEventListener("click", this.handleCreatePatient.bind(this));
        }

        if (patientsSearch) {
            this.createSearch();
        }
    }

    async readAllPatients() {
        const response = await api.get("/api/admin/patients");
        if (response.status === "error") {
            return;
        }
        this.patients = response.patients;
    }

    async readAllConsents() {
        const response = await api.get("/api/admin/consents");
        if (response.status === "error") {
            return;
        }
        this.consents = response.consents;
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

    resetValues(values) {
        for (const key of Object.keys(values)) {
            if (key === "active") {
                values[key] = true;
            } else {
                values[key] = "";
            }
        }
    }

    handleCreatePatient() {
        this.modal = new Modal({
            title: "Crear paciente",
            customTitle: () => {
                const logo = document.createElement("img");
                logo.src = "/build/img/varios/logo-blue.png";
                logo.classList.add("custom-title");
                return logo;
            },
            content: this.createPatientForm(),
            action: "Guardar",
            maxWidth: "700px",
            fullscreenButton: true,
            actionCallback: () => this.createPatient(),
            closeCallback: () => {
                this.resetValues(this.values);
                this.errors = null;
                this.patient = null;
            },
            fullscreenCallback: () => {
                this.values.signature = this.signature.getBase64();
                this.signature.resize();
                this.modal.repaint(this.createPatientForm());
            },
        });
    }

    async createPatient() {
        this.values.signature = this.signature.getBase64();
        const response = await api.post("/api/admin/patients", this.values);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createPatientForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `Paciente creado!`,
            message: "El paciente ha sido creado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.addRowAtStart(response.patient);

        this.resetValues(this.values);
        this.errors = null;
    }

    handleUpdatePatient(patient) {
        this.patient = patient;
        this.setValues(patient);

        patient.consents.forEach((consent) => {
            if (consent.consent_id === 1) {
                this.setValues(consent.signature);
            }
        });

        this.modal = new Modal({
            title: "Actualizar paciente",
            content: this.createPatientForm(),
            action: "Actualizar",
            maxWidth: "700px",
            fullscreenButton: true,
            actionCallback: () => this.updatePatient(),
            closeCallback: () => {
                this.resetValues(this.values);
                this.errors = null;
                this.patient = null;
            },
            fullscreenCallback: () => {
                this.signature.resize();
            },
        });
    }

    async updatePatient() {
        const { signature, ...values } = this.values;
        this.patient = { ...this.patient, ...values };

        if (this.patient.consents.length > 0) {
            this.patient.consents.forEach((consent) => {
                if (consent.consent_id === 1) {
                    consent.signature.signature = this.signature.getBase64();
                }
            });
        } else {
            this.patient.signature = this.signature.getBase64();
        }

        const response = await api.put("/api/admin/patients", this.patient);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createPatientForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Paciente actualizado!`,
            message: "El paciente ha sido actualziado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.patient);

        this.patient = null;
        this.resetValues(this.values);
        this.errors = null;
    }

    async updatePatientActive() {
        const response = await api.put("/api/admin/patients/active", this.patient);
        if (response.status === "error") {
            return;
        }
        this.table.updateRow(response.patient);
    }

    async deletePatient(patient) {
        const confirm = new Confirm({
            title: "¿Eliminar paciente?",
            description: "¿Estás seguro de eliminar esta paciente? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const data = {
            id: patient.id,
        };

        const response = await api.delete("/api/admin/patients", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "Paciente eliminado!",
            message: "El paciente ha sido eliminado correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(patient);
    }

    async deletePatients(selectedPatients) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedPatients.length > 1 ? "pacientes" : "paciente"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedPatients.length > 1 ? "estos pacientes" : "esta paciente"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete("/api/admin/patients/multiple", selectedPatients);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${selectedPatients.length > 1 ? "Pacientes eliminados" : "Paciente eliminado"}!`,
            message: `${
                selectedPatients.length > 1 ? "Los pacientes han sido eliminados" : "El paciente ha sido eliminado"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedPatients);
    }

    createSearch() {
        const form = document.querySelector("#patients-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar paciente",
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

    createPatientForm() {
        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;

        const double1 = document.createElement("div");
        double1.classList.add("mio-double");
        form.appendChild(double1);

        const name = new Input({
            label: {
                text: "Nombre",
                for: "name",
            },
            input: {
                type: "text",
                name: "name",
                id: "name",
                value: this.values.name,
            },
            error: this.errors && this.errors.name,
            message: this.errors && this.errors.name ? this.errors.name : "",
            callback: (value) => {
                this.values.name = value;
                this.errors = null;
            },
        });
        double1.appendChild(name.getField());

        const surname = new Input({
            label: {
                text: "Apellidos",
                for: "surname",
            },
            input: {
                type: "text",
                name: "surname",
                id: "surname",
                value: this.values.surname,
            },
            callback: (value) => {
                this.values.surname = value;
            },
        });
        double1.appendChild(surname.getField());

        const double2 = document.createElement("div");
        double2.classList.add("mio-double");
        form.appendChild(double2);

        const phone = new Input({
            label: {
                text: "Teléfono",
                for: "phone",
            },
            input: {
                type: "text",
                name: "phone",
                id: "phone",
                value: this.values.phone,
            },
            callback: (value) => {
                this.values.phone = value;
            },
        });
        double2.appendChild(phone.getField());

        const nif = new Input({
            label: {
                text: "NIF",
                for: "nif",
            },
            input: {
                type: "text",
                name: "nif",
                id: "nif",
                value: this.values.nif,
            },
            callback: (value) => {
                this.values.nif = value;
            },
        });
        double2.appendChild(nif.getField());

        const email = new Input({
            label: {
                text: "Email",
                for: "email",
            },
            input: {
                type: "email",
                name: "email",
                id: "email",
                value: this.values.email,
            },
            error: this.errors && this.errors.email,
            message: this.errors && this.errors.email ? this.errors.email : "",
            callback: (value) => {
                this.values.email = value;
            },
        });
        form.appendChild(email.getField());

        const double3 = document.createElement("div");
        double3.classList.add("mio-double");
        form.appendChild(double3);

        const birthDate = new Datepicker({
            label: {
                text: "Fecha de nacimiento",
                for: "birth_date",
            },
            input: {
                name: "birth_date",
                id: "birth_date",
                value: this.values.birth_date,
                readOnly: true,
                format: "short",
            },
            onSelect: (date) => {
                const offset = new Date().getTimezoneOffset();
                const dateUTC = new Date(date.getTime() - offset * 60 * 1000);
                this.values.birth_date = dateUTC.toISOString().split("T")[0];
            },
        });
        double3.appendChild(birthDate.get());

        const gender = new Select({
            label: {
                text: "Género",
                for: "gender",
            },
            select: {
                name: "gender",
                id: "gender",
            },
            option: {
                value: "value",
                text: "text",
            },
            options: [
                { value: "male", text: "Hombre" },
                { value: "female", text: "Mujer" },
            ],
            selected: this.values.gender ? { value: this.values.gender } : null,
            onSelect: (option) => {
                this.values.gender = option.value;
            },
        });
        double3.appendChild(gender.getField());

        const meet = new Select({
            label: {
                text: "¿Cómo nos ha conocido?",
                for: "meet",
            },
            select: {
                name: "meet",
                id: "meet",
            },
            option: {
                value: "value",
                text: "text",
            },
            options: [
                { value: "recommendation", text: "Recomendación" },
                { value: "social-media", text: "Redes sociales" },
                { value: "web", text: "Web" },
                { value: "street", text: "Calle" },
                { value: "insurance", text: "Seguro" },
                { value: "other", text: "Otro" },
            ],
            selected: this.values.meet ? { value: this.values.meet } : null,
            onSelect: (option) => {
                this.values.meet = option.value;
                this.modal.repaint(this.createPatientForm());
            },
        });

        if (this.values.meet === "insurance") {
            const double4 = document.createElement("div");
            double4.classList.add("mio-double");
            form.appendChild(double4);

            double4.appendChild(meet.getField());

            const insurance = new Input({
                label: {
                    text: "Seguro",
                    for: "insurance",
                },
                input: {
                    type: "text",
                    name: "insurance",
                    id: "insurance",
                    value: this.values.insurance,
                },
                callback: (value) => {
                    this.values.insurance = value;
                },
            });
            double4.appendChild(insurance.getField());
        } else {
            form.appendChild(meet.getField());
        }

        const address = new Input({
            label: {
                text: "Dirección",
                for: "address",
            },
            input: {
                type: "text",
                name: "address",
                id: "address",
                value: this.values.address,
            },
            callback: (value) => {
                this.values.address = value;
            },
        });
        form.appendChild(address.getField());

        const double5 = document.createElement("div");
        double5.classList.add("mio-double");
        form.appendChild(double5);

        const postcode = new Input({
            label: {
                text: "Código postal",
                for: "postcode",
            },
            input: {
                type: "text",
                name: "postcode",
                id: "postcode",
                value: this.values.postcode,
            },
            callback: (value) => {
                this.values.postcode = value;
            },
        });
        double5.appendChild(postcode.getField());

        const location = new Input({
            label: {
                text: "Localidad",
                for: "location",
            },
            input: {
                type: "text",
                name: "location",
                id: "location",
                value: this.values.location,
            },
            callback: (value) => {
                this.values.location = value;
            },
        });
        double5.appendChild(location.getField());

        const double6 = document.createElement("div");
        double6.classList.add("mio-double");
        form.appendChild(double6);

        const province = new Input({
            label: {
                text: "Provincia",
                for: "province",
            },
            input: {
                type: "text",
                name: "province",
                id: "province",
                value: this.values.province,
            },
            callback: (value) => {
                this.values.province = value;
            },
        });
        double6.appendChild(province.getField());

        const country = new Input({
            label: {
                text: "País",
                for: "country",
            },
            input: {
                type: "text",
                name: "country",
                id: "country",
                value: this.values.country,
            },
            callback: (value) => {
                this.values.country = value;
            },
        });
        double6.appendChild(country.getField());

        const reason = new Textarea({
            label: {
                text: "Motivo de la consulta",
                for: "reason",
            },
            input: {
                name: "reason",
                id: "reason",
                rows: 2,
                maxlength: 255,
                value: this.values.reason,
            },
            callback: (value) => {
                this.values.reason = value;
            },
        });
        form.appendChild(reason.getField());

        const medication = new Textarea({
            label: {
                text: "Medicación",
                for: "medication",
            },
            input: {
                name: "medication",
                id: "medication",
                rows: 2,
                maxlength: 255,
                value: this.values.medication,
            },
            callback: (value) => {
                this.values.medication = value;
            },
        });
        form.appendChild(medication.getField());

        const allergies = new Textarea({
            label: {
                text: "Alergias",
                for: "allergies",
            },
            input: {
                name: "allergies",
                id: "allergies",
                rows: 2,
                maxlength: 255,
                value: this.values.allergies,
            },
            callback: (value) => {
                this.values.allergies = value;
            },
        });
        form.appendChild(allergies.getField());

        const diseases = new Textarea({
            label: {
                text: "Enfermedades",
                for: "diseases",
            },
            input: {
                name: "diseases",
                id: "diseases",
                rows: 2,
                maxlength: 255,
                value: this.values.diseases,
            },
            callback: (value) => {
                this.values.diseases = value;
            },
        });
        form.appendChild(diseases.getField());

        const double7 = document.createElement("div");
        double7.classList.add("mio-double");
        form.appendChild(double7);

        const smoker = new Select({
            label: {
                text: "Fumador",
                for: "smoker",
            },
            select: {
                name: "smoker",
                id: "smoker",
            },
            option: {
                value: "value",
                text: "text",
            },
            options: [
                { value: "1", text: "Sí" },
                { value: "0", text: "No" },
            ],
            selected: this.values.smoker !== "" ? { value: this.values.smoker } : null,
            onSelect: (option) => {
                this.values.smoker = option.value;
            },
        });
        double7.appendChild(smoker.getField());

        const infectious = new Select({
            label: {
                text: "Enfermedades infecciosas",
                for: "infectious",
            },
            select: {
                name: "infectious",
                id: "infectious",
            },
            option: {
                value: "value",
                text: "text",
            },
            options: [
                { value: "none", text: "Ninguna" },
                { value: "hiv", text: "VIH - Sida" },
                { value: "tuberculosis", text: "Tuberculosis" },
                { value: "hepatitis_b", text: "Hepatitis B" },
                { value: "hepatitis_c", text: "Hepatitis C" },
                { value: "hepatitis_d", text: "Hepatitis D" },
                { value: "other", text: "Otras" },
            ],
            selected: this.values.infectious ? { value: this.values.infectious } : null,
            onSelect: (option) => {
                this.values.infectious = option.value;
            },
        });
        double7.appendChild(infectious.getField());

        if (this.patient) {
            const comment = new Textarea({
                label: {
                    text: "Comentario",
                    for: "comment",
                },
                input: {
                    name: "comment",
                    id: "comment",
                    rows: 2,
                    maxlength: 255,
                    value: this.values.comment,
                },
                callback: (value) => {
                    this.values.comment = value;
                },
            });

            const commentField = comment.getField();
            form.appendChild(commentField);
        }

        const signatureField = document.createElement("div");
        signatureField.classList.add("mio-field");
        form.appendChild(signatureField);

        this.signature = new Signature({
            container: signatureField,
            title: "Firma",
            clear: true,
            signature: this.values.signature,
        });

        const consent = document.createElement("p");
        consent.classList.add("form-consent");
        consent.textContent = this.consents.find((consent) => consent.id === 1).description;
        form.appendChild(consent);

        return form;
    }

    showPatientsTable() {
        const patientsContainer = document.querySelector("#patients-table");

        this.table = new Table({
            columns: this.columns,
            customColumns: [
                {
                    field: "active",
                    headerName: "Activo",
                    content: this.createSwitchForm.bind(this),
                },
            ],
            rows: this.patients,
            findFields: ["id", "name", "surname", "phone", "email"],
            container: patientsContainer,
            visibleRows: 15,
            rowsPerPage: 20,
            update: this.handleUpdatePatient.bind(this),
            delete: this.deletePatient.bind(this),
            deleteSelected: this.deletePatients.bind(this),
            showActionsMenu: true,
            extraActions: [
                {
                    name: "Crear presupuesto",
                    icon: icon.get("fileCheck"),
                    callback: this.handleCreateBudget.bind(this),
                },
                {
                    name: "Consentimientos firmados",
                    icon: icon.get("fileCheck"),
                    callback: this.handleConsentsAccepted.bind(this),
                },
                {
                    name: "Crear consentimiento",
                    icon: icon.get("filePlus"),
                    callback: this.handleCreateConsent.bind(this),
                },
                {
                    name: "Historial médico",
                    icon: icon.get("clipboard2Pulse"),
                    callback: this.handleManageHistory.bind(this),
                },
                {
                    name: "Exportar a PDF",
                    icon: icon.get("filePDF"),
                    callback: this.generatePatientPDF.bind(this),
                },
            ],
            extraActionsMultipleSelect: [
                {
                    name: "Enviar Email",
                    icon: icon.get("envelope"),
                    callback: this.handleSendEmail.bind(this),
                },
            ],
        });
    }

    createSwitchForm(row) {
        const form = document.createElement("form");
        form.classList.add("mio-form");

        const active = new Switch({
            label: {
                text: "",
                for: "active",
            },
            input: {
                name: "active",
                id: "active",
                value: row.active,
            },
            size: "small",
            callback: (value) => {
                this.patient = row;
                this.patient.active = value;

                this.updatePatientActive();
            },
        });

        form.appendChild(active.getField());

        return form;
    }

    handleConsentsAccepted(patient) {
        this.patient = patient;

        this.modal = new Modal({
            title: "Consentimientos firmados",
            content: this.createConsentsAccepted(),
            action: "Aceptar",
            maxWidth: "700px",
            fullscreenButton: true,
            actionCallback: () => {
                this.modal.close();
            },
            closeCallback: () => {
                this.patient = null;
            },
        });
    }

    createConsentsAccepted() {
        const consents = document.createElement("div");
        consents.classList.add("consents");

        this.patient.consents.forEach((patientConsent) => {
            const consent = this.consents.find((consent) => consent.id === patientConsent.consent_id);

            const consentButton = document.createElement("button");
            consentButton.classList.add("consent-preview");
            consentButton.ariaLabel = consent.name;
            consentButton.addEventListener("click", () => {
                const { consents, ...patient } = this.patient;

                const newConsent = { ...patientConsent };

                newConsent.consent = consent;
                newConsent.patient = patient;
                newConsent.doctor = this.doctors.find((doctor) => doctor.id === newConsent.doctor_id);
                newConsent.created_at = dateFormat(newConsent.created_at);

                this.generateConsentPDF(newConsent);
            });

            consents.appendChild(consentButton);

            const consentIcon = document.createElement("div");
            consentIcon.classList.add("icon");
            consentButton.appendChild(consentIcon);

            const iconPDF = icon.get("filePDF");
            consentIcon.appendChild(iconPDF);

            const consentText = document.createElement("div");
            consentText.classList.add("text");
            consentButton.appendChild(consentText);

            const name = document.createElement("span");
            name.textContent = consent.name;
            consentText.appendChild(name);

            const date = document.createElement("span");
            date.textContent = dateFormat(patientConsent.created_at);
            consentText.appendChild(date);
        });

        return consents;
    }

    async generateConsentPDF(consent) {
        const response = await api.post("/api/admin/consents/pdf", consent);

        const linkSource = `data:application/pdf;base64,${response.base64}`;
        const downloadLink = document.createElement("a");
        const fileName = response.fileName;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    handleCreateConsent(patient) {
        this.consent.patient = patient;

        this.createConsentModal = new Modal({
            title: "Crear consentimiento",
            content: this.createConsentForm(),
            action: "Guardar",
            maxWidth: "700px",
            fullscreenButton: true,
            actionCallback: this.createConsent.bind(this),
            closeCallback: () => {
                this.consent = {
                    patient: null,
                    doctor: null,
                    representative: false,
                    representative_name: null,
                    representative_nif: null,
                };
                this.consentErrors = null;
            },
        });
    }

    async createConsent() {
        const response = await api.post("/api/admin/consents/accepted", this.consent);

        if (response.status === "error") {
            this.consentErrors = response.errors;
            this.modal.repaint(this.createPatientForm());
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Consentimiento creado!",
            message: "El consentimiento ha sido creado correctamente.",
            timer: 3000,
        });

        await this.createConsentModal.close();
        this.table.updateRow(response.patient);
    }

    createConsentForm() {
        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;

        const double1 = document.createElement("div");
        double1.classList.add("mio-double");
        form.appendChild(double1);

        const doctor = new Input({
            label: {
                text: "Doctor",
                for: "doctor",
            },
            input: {
                name: "doctor",
                id: "doctor",
                type: "text",
                value: this.consent.doctor ? this.consent.doctor.name + " " + this.consent.doctor.surname : "",
            },
            error: this.consentErrors && this.consentErrors.doctor,
            message: this.consentErrors && this.consentErrors.doctor ? this.consentErrors.doctor : "",
            callback: () => {
                this.consentErrors = null;
            },
        });
        const doctorField = doctor.getField();
        double1.appendChild(doctorField);

        new Autocomplete({
            target: doctorField.querySelector("input"),
            data: this.doctors,
            findFields: ["name", "surname"],
            showFields: ["name", "surname"],
            size: 6,
            callback: (doctor) => {
                this.consent.doctor = doctor;
                this.createConsentModal.repaint(this.createConsentForm());
            },
        });

        const patient = new Input({
            label: {
                text: "Paciente",
                for: "patient",
            },
            input: {
                name: "patient",
                id: "patient",
                type: "text",
                value: this.consent.patient ? this.consent.patient.name + " " + this.consent.patient.surname : "",
            },
            error: this.consentErrors && this.consentErrors.patient,
            message: this.consentErrors && this.consentErrors.patient ? this.consentErrors.patient : "",
            callback: () => {
                this.consentErrors = null;
            },
        });
        const patientField = patient.getField();
        double1.appendChild(patientField);

        new Autocomplete({
            target: patientField.querySelector("input"),
            data: this.patients,
            findFields: ["name", "surname"],
            showFields: ["name", "surname"],
            size: 6,
            callback: (patient) => {
                this.consent.patient = patient;
                this.createConsentModal.repaint(this.createConsentForm());
            },
        });

        const representativeSwitch = new Switch({
            label: {
                text: "Representante legal",
                for: "representative",
            },
            input: {
                name: "representative",
                id: "representative",
                value: this.consent.representative,
            },
            size: "small",
            callback: (value) => {
                this.consent.representative = value;
                this.createConsentModal.repaint(this.createConsentForm());
            },
        });
        form.appendChild(representativeSwitch.getField());

        if (this.consent.representative) {
            const representativeName = new Input({
                label: {
                    text: "Nombre del representante",
                    for: "representative_name",
                },
                input: {
                    name: "representative_name",
                    id: "representative_name",
                    type: "text",
                    value: this.consent.representative_name,
                },
                error: this.consentErrors && this.consentErrors.representative_name,
                message:
                    this.consentErrors && this.consentErrors.representative_name
                        ? this.consentErrors.representative_name
                        : "",
                callback: (value) => {
                    this.consent.representative_name = value;
                    this.consentErrors = null;
                },
            });
            form.appendChild(representativeName.getField());

            const representativeNif = new Input({
                label: {
                    text: "NIF del representante",
                    for: "representative_nif",
                },
                input: {
                    name: "representative_nif",
                    id: "representative_nif",
                    type: "text",
                    value: this.consent.representative_nif,
                },
                error: this.consentErrors && this.consentErrors.representative_nif,
                message:
                    this.consentErrors && this.consentErrors.representative_nif
                        ? this.consentErrors.representative_nif
                        : "",
                callback: (value) => {
                    this.consent.representative_nif = value;
                    this.consentErrors = null;
                },
            });
            form.appendChild(representativeNif.getField());
        }

        const consents = new Select({
            label: {
                text: "Consentimientos",
                for: "consent",
            },
            select: {
                name: "consent",
                id: "consent",
            },
            option: {
                value: "id",
                text: "name",
            },
            options: this.consents.filter((consent) => consent.id !== 1),
            selected: this.consent.consent ? { id: this.consent.consent.id } : null,
            error: this.consentErrors && this.consentErrors.consent,
            message: this.consentErrors && this.consentErrors.consent ? this.consentErrors.consent : "",
            onSelect: (option) => {
                this.consent.consent = option;
                this.consentErrors = null;
            },
        });
        form.appendChild(consents.getField());

        const signatureField = document.createElement("div");
        signatureField.classList.add("mio-field");
        form.appendChild(signatureField);

        const signatureButton = document.createElement("button");
        signatureButton.classList.add("btn", "tertiary-btn");
        signatureButton.type = "button";
        signatureButton.textContent = "Firmar consentimiento";
        signatureButton.ariaLabel = "Firma consentimiento";
        signatureButton.addEventListener("click", () => {
            let errors = false;

            if (!this.consent.patient) {
                errors = true;
                this.consentErrors = {
                    ...this.consentErrors,
                    patient: "El paciente es obligatorio",
                };
            }

            if (!this.consent.doctor) {
                errors = true;
                this.consentErrors = { ...this.consentErrors, doctor: "El doctor es obligatorio" };
            }

            if (!this.consent.consent) {
                errors = true;
                this.consentErrors = {
                    ...this.consentErrors,
                    consent: "El consentimiento es obligatorio",
                };
            }

            if (this.consent.representative && !this.consent.representative_name) {
                errors = true;
                this.consentErrors = {
                    ...this.consentErrors,
                    representative_name: "El nombre del representante es obligatorio",
                };
            }

            if (this.consent.representative && !this.consent.representative_nif) {
                errors = true;
                this.consentErrors = {
                    ...this.consentErrors,
                    representative_nif: "El NIF del representante es obligatorio",
                };
            }

            if (errors) {
                this.createConsentModal.repaint(this.createConsentForm());
                return;
            }

            this.signConsentModal = new Modal({
                title: "Firmar consentimiento",
                customTitle: () => {
                    const logo = document.createElement("img");
                    logo.src = "/build/img/varios/logo-blue.png";
                    logo.classList.add("custom-title");
                    return logo;
                },
                content: this.createConsentSignForm(),
                action: "Guardar",
                maxWidth: "700px",
                fullscreenButton: true,
                actionCallback: () => {
                    this.consent.signature = this.signature.getBase64();
                    this.signConsentModal.close();
                },
                closeCallback: () => {},
                fullscreenCallback: () => {
                    this.signature.resize();
                },
            });
        });
        signatureField.appendChild(signatureButton);

        return form;
    }

    createConsentSignForm() {
        const { patient, doctor, consent, representative, representative_name, representative_nif, signature } =
            this.consent;

        const consentEl = document.createElement("div");
        consentEl.classList.add("consent");

        const name = document.createElement("p");
        name.textContent = consent.name;
        consentEl.appendChild(name);

        const today = new Date();

        let text = consent.description;

        if (representative) {
            text = text.replace(
                "{intro}",
                `Yo ${representative_name}, con DNI ${representative_nif} mayor de edad, en calidad de (representante legal) de ${patient.name} ${patient.surname} DECLARO:`
            );
        } else {
            text = text.replace(
                "{intro}",
                `Yo, ${patient.name} ${patient.surname} (como paciente), con DNI ${patient.nif}, mayor de edad DECLARO:`
            );
        }

        text = text.replace("{doctor}", doctor.name + " " + doctor.surname);
        text = text.replace("{date}", dateFormat(today));

        const descriptionEl = document.createElement("p");
        descriptionEl.textContent = text;
        consentEl.appendChild(descriptionEl);

        const signatureField = document.createElement("div");
        signatureField.classList.add("mio-field");
        consentEl.appendChild(signatureField);

        this.signature = new Signature({
            container: signatureField,
            title: "Firma",
            clear: true,
            signature: signature && signature.signature ? signature.signature : signature,
        });

        return consentEl;
    }

    handleManageHistory(patient) {
        this.patient = structuredClone(patient);

        this.history = new History({
            history: this.patient.history || [],
            callback: () => {
                this.history.repaint();
                this.historyModal.repaint(this.history.getHistoryEl());
            },
        });

        this.historyModal = new Modal({
            title: "Historial médico",
            content: this.history.getHistoryEl(),
            action: "Guardar cambios",
            maxWidth: "800px",
            fullscreenButton: true,
            actionCallback: this.updateHistory.bind(this),
            closeCallback: () => {},
            fullscreenCallback: () => {},
        });
    }

    async updateHistory() {
        this.patient.history.reports = this.history.getReports();

        const response = await api.put("/api/admin/patients/history", this.patient);

        if (response.status === "error") {
            if (response.type === "history") {
                this.history.history.errors = response.errors;
            }

            if (response.type === "reports") {
                this.history.history.reports.forEach((report) => {
                    response.errors.forEach((error) => {
                        if (error.id === report.id) {
                            report.errors = error.errors;
                        }
                    });
                });
            }

            this.history.repaint();
            this.historyModal.repaint(this.history.getHistoryEl());
            return;
        }

        await popup.open({
            type: "success",
            title: "Historial actualizado!",
            message: "El historial ha sido actualziado correctamente.",
            timer: 3000,
        });

        await this.historyModal.close();

        this.table.updateRow(response.patient);
    }

    async generatePatientPDF(patient) {
        this.patient = structuredClone(patient);

        const response = await api.post("/api/admin/patients/pdf", this.patient);

        const linkSource = `data:application/pdf;base64,${response.base64}`;
        const downloadLink = document.createElement("a");
        const fileName = response.fileName;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    handleSendEmail(selected) {
        this.modal = new Modal({
            title: "Enviar email a " + selected.length + " pacientes",
            content: this.createEmailForm(),
            action: "Enviar",
            maxWidth: "700px",
            actionCallback: () => {
                this.sendEmail(selected);
            },
            closeCallback: () => {
                this.email = {
                    subject: "Novedades en clínica dental",
                    header: "¡Hola {name}...",
                    body: "Hola {name}, desde Dentiny te informamos que...",
                    footer: "Recibe un cordial saludo...",
                };
                this.emailErrors = null;
            },
        });
    }

    async sendEmail(selected) {
        const data = {
            patients: selected,
            email: this.email,
        }

        const response = await api.post("/api/admin/patients/email", data);
        console.log(response);

        if (response.status === "error") {
            this.emailErrors = response.errors;
            this.modal.repaint(this.createEmailForm());
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Mensaje enviado!",
            message: "El mensaje ha sido enviado correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.email = {
            subject: "Novedades en clínica dental",
            header: "¡Hola {name}...",
            body: "Hola {name}, desde Dentiny te informamos que...",
            footer: "Recibe un cordial saludo...",
        };
        this.emailErrors = null;
    }

    createEmailForm() {
        const form = document.createElement("form");
        form.noValidate = true;
        form.classList.add("mio-form");

        const subject = new Input({
            label: {
                text: "Asunto",
                for: "subject",
            },
            input: {
                type: "text",
                name: "subject",
                id: "subject",
                value: this.email.subject,
            },
            error: this.emailErrors && this.emailErrors.subject,
            message: this.emailErrors && this.emailErrors.subject ? this.emailErrors.subject : "",
            callback: (value) => {
                this.email.subject = value;
                this.emailErrors = null;
            },
        });
        form.appendChild(subject.getField());

        const header = new Input({
            label: {
                text: "Encabezado",
                for: "header",
            },
            input: {
                type: "text",
                name: "header",
                id: "header",
                value: this.email.header,
            },
            error: this.emailErrors && this.emailErrors.header,
            message: this.emailErrors && this.emailErrors.header ? this.emailErrors.header : "",
            callback: (value) => {
                this.email.header = value;
                this.emailErrors = null;
            },
        });
        form.appendChild(header.getField());

        const body = new Textarea({
            label: {
                text: "Mensaje",
                for: "body",
            },
            input: {
                name: "body",
                id: "body",
                rows: 6,
                value: this.email.body,
            },
            error: this.emailErrors && this.emailErrors.body,
            message: this.emailErrors && this.emailErrors.body ? this.emailErrors.body : "",
            callback: (value) => {
                this.email.body = value;
                this.emailErrors = null;
            },
        });
        form.appendChild(body.getField());

        const footer = new Input({
            label: {
                text: "Despedida",
                for: "footer",
            },
            input: {
                type: "text",
                name: "footer",
                id: "footer",
                value: this.email.footer,
            },
            error: this.emailErrors && this.emailErrors.footer,
            message: this.emailErrors && this.emailErrors.footer ? this.emailErrors.footer : "",
            callback: (value) => {
                this.email.footer = value;
                this.emailErrors = null;
            },
        });
        form.appendChild(footer.getField());

        return form;
    }

    handleCreateBudget(selected) {
        budgets.budget.patient = selected;
        budgets.handleCreateBudget();
    }
}

export default Patients;
