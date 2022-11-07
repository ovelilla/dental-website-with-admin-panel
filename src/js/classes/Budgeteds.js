import { api } from "../app.js";
import Autocomplete from "./Autocomplete.js";
import Modal from "./Modal.js";
import Pieces from "./Pieces.js";

class Budgeteds {
    constructor({ budgeteds, callback }) {
        this.budgeteds = budgeteds;
        this.callback = callback;

        this.treatments = [];

        this.total = 0;
        this.errors = [];

        this.id = 1;

        this.targetFocus = "";

        this.columns = [
            { field: "treatment_id", headerName: "Tratamiento" },
            { field: "piece", headerName: "Pieza" },
            { field: "unit_price", headerName: "Precio" },
            { field: "discount", headerName: "Dto." },
            { field: "total_price", headerName: "Total" },
        ];
    }

    getBudgeteds() {
        return this.budgeteds;
    }

    addBudgeted(budgeted) {
        this.budgeteds = [...this.budgeteds, budgeted];
    }

    updateBudgeted(updatedBudgeted) {
        this.budgeteds = this.budgeteds.map((budgeted) =>
            budgeted.id === updatedBudgeted.id ? updatedBudgeted : budgeted
        );
    }

    deleteBudgeted(deletedBudgeted) {
        this.budgeteds = this.budgeteds.filter((budgeted) => budgeted.id !== deletedBudgeted.id);
    }

    clearBudgeteds() {
        this.budgeteds = [];
    }

    getBudgetedsEl() {
        return this.budgetedsEl;
    }

    async readAllTreatments() {
        const response = await api.get("/api/admin/treatments");
        if (response.status === "error") {
            return;
        }
        this.treatments = response.treatments;
    }

    show() {
        this.budgetedsEl = document.createElement("div");
        this.budgetedsEl.classList.add("budgeted");

        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        this.budgetedsEl.appendChild(wrapper);

        const table = this.createTable();
        wrapper.appendChild(table);

        const add = this.createAddRow();
        this.budgetedsEl.appendChild(add);
    }

    repaint() {
        this.show();
    }

    createTable() {
        const table = document.createElement("table");

        const thead = this.createThead();
        table.appendChild(thead);

        this.tbody = this.createTbody();
        table.appendChild(this.tbody);

        const tfoot = this.createTfoot();
        table.appendChild(tfoot);
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

        this.budgeteds.forEach((budgeted) => {
            const row = this.createRow(budgeted);
            tbody.appendChild(row);
        });

        return tbody;
    }

    createTfoot() {
        const tfoot = document.createElement("tfoot");

        const tr = document.createElement("tr");
        tfoot.appendChild(tr);

        const tdTotalText = document.createElement("td");
        tdTotalText.colSpan = this.columns.length - 1;
        tdTotalText.textContent = "Total";
        tr.appendChild(tdTotalText);

        const tdTotalNumber = document.createElement("td");
        tdTotalNumber.textContent = this.getTotal().toFixed(2).replace(".", ",");
        tr.appendChild(tdTotalNumber);

        return tfoot;
    }

    createRow(budgeted) {
        const tr = document.createElement("tr");

        const tdTreatment = document.createElement("td");
        tr.appendChild(tdTreatment);

        const inputTreatment = document.createElement("input");
        if (budgeted.errors) {
            inputTreatment.classList.add("error");
        }
        inputTreatment.type = "text";
        inputTreatment.name = "treatment";
        inputTreatment.value = budgeted.treatment ? budgeted.treatment.name : "";
        inputTreatment.placeholder = "Tratamiento";
        inputTreatment.addEventListener("input", (e) => {
            inputTreatment.classList.remove("error");
            inputPrice.classList.remove("error");
            budgeted.errors = null;
            this.targetFocus = {
                budgeted,
                input: inputTreatment,
                position: inputTreatment.selectionStart,
            };
        });

        new MutationObserver(() => {
            if (
                this.targetFocus &&
                this.targetFocus.budgeted === budgeted &&
                this.targetFocus.input.isEqualNode(inputTreatment)
            ) {
                inputTreatment.focus();
                inputTreatment.setSelectionRange(this.targetFocus.position, this.targetFocus.position);
            }
        }).observe(tdTreatment, { childList: true });
        tdTreatment.appendChild(inputTreatment);

        new Autocomplete({
            target: inputTreatment,
            data: this.treatments,
            findFields: ["name", "description"],
            showFields: ["name"],
            size: 6,
            callback: (treatment) => {
                budgeted.treatment = treatment;
                budgeted.unit_price = treatment ? treatment.price : null;
                budgeted.total_price = this.getTotalTreatment(budgeted);
                inputPrice.value = treatment ? treatment.price : "";
                inputTotal.value = this.getTotalTreatment(budgeted).toFixed(2);
                this.callback();
            },
        });

        const tdPiece = document.createElement("td");
        tr.appendChild(tdPiece);

        const inputPiece = document.createElement("input");
        inputPiece.type = "text";
        inputPiece.name = "piece";
        inputPiece.value = budgeted.piece ? budgeted.piece : "";
        inputPiece.placeholder = "Pieza";
        inputPiece.readOnly = true;
        inputPiece.addEventListener("click", async () => {
            this.pieces = new Pieces({
                selectedPieces: budgeted.selectedPieces,
                selectedGroup: budgeted.selectedGroup,
                callback: () => {
                    this.modal.repaint(this.pieces.getPiecesEl());
                },
            });

            await this.pieces.init();

            this.modal = new Modal({
                title: "Seleccionar piezas",
                content: this.pieces.getPiecesEl(),
                action: "Seleccionar",
                actionCallback: async () => {
                    const selectedPieces = this.pieces.getSelectedPieces();
                    const selectedGroup = this.pieces.getSelectedGroup();

                    budgeted.selectedPieces = selectedPieces;
                    budgeted.selectedGroup = selectedGroup;
                    budgeted.total_price = this.getTotalTreatment(budgeted);

                    if (selectedGroup) {
                        budgeted.piece = selectedGroup.name;
                    } else {
                        budgeted.piece = selectedPieces.map((piece) => piece.number).join(", ");
                    }

                    await this.modal.close();
                    this.callback();
                },
            });
        });
        tdPiece.appendChild(inputPiece);

        const tdPrice = document.createElement("td");
        tr.appendChild(tdPrice);

        const inputPrice = document.createElement("input");
        if (budgeted.errors) {
            inputPrice.classList.add("error");
        }
        inputPrice.type = "text";
        inputPrice.name = "price";
        inputPrice.step = "0.01";
        inputPrice.placeholder = "0,00";
        inputPrice.value = budgeted.unit_price ? budgeted.unit_price : "";
        inputPrice.addEventListener("input", () => {
            inputPrice.classList.remove("error");
            budgeted.errors = null;
            if (budgeted.treatment) {
                budgeted.unit_price = inputPrice.value;
            }
            this.targetFocus = { budgeted, input: inputPrice, position: inputPrice.selectionStart };
            this.callback();
        });

        new MutationObserver(() => {
            if (
                this.targetFocus &&
                this.targetFocus.budgeted === budgeted &&
                this.targetFocus.input.isEqualNode(inputPrice)
            ) {
                inputPrice.focus();
                inputPrice.setSelectionRange(this.targetFocus.position, this.targetFocus.position);
            }
        }).observe(tdPrice, { childList: true });
        tdPrice.appendChild(inputPrice);

        const tdDiscount = document.createElement("td");
        tr.appendChild(tdDiscount);

        const inputDiscount = document.createElement("input");
        inputDiscount.type = "text";
        inputDiscount.name = "discount";
        inputDiscount.placeholder = "0";
        inputDiscount.value = budgeted.discount ? budgeted.discount : "";
        inputDiscount.addEventListener("input", () => {
            if (budgeted.treatment) {
                budgeted.discount = inputDiscount.value;
                budgeted.total_price = this.getTotalTreatment(budgeted);
            }
            this.targetFocus = {
                budgeted,
                input: inputDiscount,
                position: inputDiscount.selectionStart,
            };
            this.callback();
        });

        new MutationObserver(() => {
            if (
                this.targetFocus &&
                this.targetFocus.budgeted === budgeted &&
                this.targetFocus.input.isEqualNode(inputDiscount)
            ) {
                inputDiscount.focus();
                inputDiscount.setSelectionRange(this.targetFocus.position, this.targetFocus.position);
            }
        }).observe(tdDiscount, { childList: true });
        tdDiscount.appendChild(inputDiscount);

        const tdTotal = document.createElement("td");
        tr.appendChild(tdTotal);

        const inputTotal = document.createElement("input");
        inputTotal.type = "number";
        inputTotal.name = "total";
        inputTotal.step = "0.01";
        inputTotal.placeholder = "0.00";
        inputTotal.value = this.getTotalTreatment(budgeted).toFixed(2);
        inputTotal.disabled = true;
        tdTotal.appendChild(inputTotal);

        const tdActions = document.createElement("td");
        tr.appendChild(tdActions);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.ariaLabel = "Eliminar";
        deleteButton.addEventListener("click", () => {
            this.deleteBudgeted(budgeted);
            this.callback();
        });
        tdActions.appendChild(deleteButton);

        const deleteIcon = this.createDeleteIcon();
        deleteButton.appendChild(deleteIcon);

        return tr;
    }

    getTotalTreatment(budgeted) {
        const priceValue = budgeted.unit_price ? parseFloat(budgeted.unit_price) : 0;
        const discountValue = budgeted.discount ? parseFloat(budgeted.discount) : 0;
        const discount = (priceValue * discountValue) / 100;
        let total = priceValue - discount;

        if (!budgeted.selectedGroup && budgeted.selectedPieces.length > 0) {
            total = total * budgeted.selectedPieces.length;
        }

        return total;
    }

    getTotal() {
        return this.budgeteds.reduce((total, budgeted) => {
            const priceValue = budgeted.unit_price ? parseFloat(budgeted.unit_price) : 0;
            const discountValue = budgeted.discount ? parseFloat(budgeted.discount) : 0;
            const discount = (priceValue * discountValue) / 100;
            let sum = priceValue - discount;

            if (!budgeted.selectedGroup && budgeted.selectedPieces.length > 0) {
                sum = sum * budgeted.selectedPieces.length;
            }

            return total + sum;
        }, 0);
    }

    createAddRow() {
        const addRow = document.createElement("div");
        addRow.classList.add("row");

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.ariaLabel = "Añadir tratamiento";
        addButton.textContent = "Añadir tratamiento";
        addButton.classList.add("btn", "primary-btn");
        addButton.addEventListener("click", () => {
            const budgeted = {
                id: crypto.randomUUID(),
                treatment: null,
                piece: null,
                unit_price: null,
                discount: null,
                total_price: null,
                selectedPieces: [],
                selectedGroup: null,
            };

            this.addBudgeted(budgeted);

            const row = this.createRow(budgeted);
            this.tbody.appendChild(row);
        });
        addRow.appendChild(addButton);

        return addRow;
    }

    createDeleteIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 16 16");

        const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("fill-rule", "evenodd");
        path1.setAttribute(
            "d",
            "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
        );
        svg.appendChild(path1);

        const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("fill-rule", "evenodd");
        path2.setAttribute(
            "d",
            "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
        );
        svg.appendChild(path2);

        return svg;
    }
}

export default Budgeteds;
