import Modal from "./Modal.js";
import Textarea from "./mio/Textarea.js";
import { icon } from "../modules/Icon.js";

class History {
    constructor({ history, callback }) {
        this.history = history;
        this.callback = callback;

        this.columns = [
            { field: "date", headerName: "Fecha" },
            { field: "description", headerName: "Descripción" },
        ];

        this.description = "";

        this.create();
    }

    addReport(report) {
        this.history.reports = [...this.history.reports, report];
    }

    updateReport(updatedReport) {
        this.history.reports = this.history.reports.map((report) =>
            report.id === updatedReport.id ? updatedReport : report
        );
    }

    deleteReport(deletedReport) {
        this.history.reports = this.history.reports.filter(
            (report) => report.id !== deletedReport.id
        );
    }

    clearReports() {
        this.history.reports = [];
    }

    getHistory() {
        return this.history;
    }

    getReports() {
        return this.history.reports;
    }

    getHistoryEl() {
        return this.historyEl;
    }

    create() {
        this.historyEl = document.createElement("div");
        this.historyEl.classList.add("history");

        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;
        this.historyEl.appendChild(form);

        const examination = new Textarea({
            label: {
                text: "Exploración y plan de tratamiento",
                for: "examination",
            },
            input: {
                name: "examination",
                id: "examination",
                rows: 6,
                value: this.history.examination,
            },
            error: this.history.errors?.examination,
            message: this.history.errors?.examination,
            callback: (value) => {
                this.history.examination = value;
                this.history.errors = null;
            },
        });
        form.appendChild(examination.getField());

        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        this.historyEl.appendChild(wrapper);

        const table = this.createTable();
        wrapper.appendChild(table);

        const add = this.createAddRow();
        this.historyEl.appendChild(add);
    }

    repaint() {
        this.create();
    }

    createTable() {
        const table = document.createElement("table");

        const thead = this.createThead();
        table.appendChild(thead);

        this.tbody = this.createTbody();
        table.appendChild(this.tbody);

        return table;
    }

    createThead() {
        const thead = document.createElement("thead");

        const tr = document.createElement("tr");
        thead.appendChild(tr);

        this.columns.forEach((column) => {
            const th = document.createElement("th");
            th.textContent = column.headerName;
            tr.appendChild(th);
        });

        const thActions = document.createElement("th");
        thActions.textContent = "";
        tr.appendChild(thActions);

        return thead;
    }

    createTbody() {
        const tbody = document.createElement("tbody");

        this.history.reports.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        this.history.reports.forEach((report) => {
            const row = this.createRow(report);
            tbody.appendChild(row);
        });

        return tbody;
    }

    createRow(report) {
        const tr = document.createElement("tr");

        const tdDate = document.createElement("td");
        tr.appendChild(tdDate);

        const inputDate = document.createElement("input");
        if (report.errors && report.errors.date) {
            inputDate.classList.add("error");
        }
        inputDate.type = "date";
        inputDate.name = "date";
        inputDate.value = report.date;
        inputDate.placeholder = "Fecha";
        inputDate.addEventListener("input", () => {
            report.errors = null;
            report.date = inputDate.value;
            inputDate.classList.remove("error");
        });
        tdDate.appendChild(inputDate);

        const tdDescription = document.createElement("td");
        tr.appendChild(tdDescription);

        const inputDescription = document.createElement("input");
        if (report.errors && report.errors.description) {
            inputDescription.classList.add("error");
        }
        inputDescription.type = "text";
        inputDescription.name = "description";
        inputDescription.value = report.description;
        inputDescription.placeholder = "Descripción";
        inputDescription.readOnly = true;
        inputDescription.addEventListener("click", async () => {
            report.errors = null;

            this.description = report.description;

            this.modal = new Modal({
                title: "Descripción",
                content: this.createDescriptionForm(),
                action: "Aceptar",
                maxWidth: "700px",
                fullscreenButton: true,
                actionCallback: () => {
                    this.modal.close();
                    report.description = this.description;
                    inputDescription.value = this.description;
                    this.callback();
                },
                closeCallback: () => {},
                fullscreenCallback: () => {},
            });
        });
        tdDescription.appendChild(inputDescription);

        const tdActions = document.createElement("td");
        tr.appendChild(tdActions);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.ariaLabel = "Eliminar";
        deleteButton.addEventListener("click", () => {
            this.deleteReport(report);
            this.callback();
        });
        tdActions.appendChild(deleteButton);

        deleteButton.appendChild(icon.get("trash"));

        return tr;
    }

    createAddRow() {
        const addRow = document.createElement("div");
        addRow.classList.add("row");

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.ariaLabel = "Añadir informe";
        addButton.textContent = "Añadir informe";
        addButton.classList.add("btn", "primary-btn");
        addButton.addEventListener("click", () => {
            const report = {
                id: crypto.randomUUID(),
                date: new Date().toISOString().split("T")[0],
                description: "",
                errors: null,
            };

            this.addReport(report);

            const row = this.createRow(report);
            this.tbody.appendChild(row);
        });
        addRow.appendChild(addButton);

        return addRow;
    }

    createDescriptionForm() {
        const form = document.createElement("form");
        form.classList.add("mio-form");
        form.noValidate = true;

        const description = new Textarea({
            label: {
                text: "Descripción",
                for: "description",
            },
            input: {
                name: "description",
                id: "description",
                rows: 20,
                value: this.description,
            },
            callback: (value) => {
                this.description = value;
            },
        });
        form.appendChild(description.getField());

        return form;
    }
}

export default History;
