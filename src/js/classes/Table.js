import { icon } from "../modules/Icon.js";
import Menu from "./Menu.js";
import IconButton from "./mio/IconButton.js";

class Table {
    constructor(options) {
        this.columns = options.columns;
        this.customColumns = options.customColumns || [];
        this.rows = options.rows;
        this.copyRows = options.rows;
        this.findFields = options.findFields;

        this.container = options.container;
        this.visibleRows = options.visibleRows;
        this.rowsPerPage = options.rowsPerPage;

        this.update = options.update;
        this.delete = options.delete;
        this.deleteSelected = options.deleteSelected;

        this.showActionsMenu = options.showActionsMenu;
        this.extraActions = options.extraActions || [];
        this.extraActionsMultipleSelect = options.extraActionsMultipleSelect || [];

        this.selectedRows = [];

        this.sort = false;
        this.sortColumn = null;

        this.page = 1;
        this.pages = 0;

        this.init();
    }

    init() {
        this.setPages(this.calculatePages());
        this.createTable();
    }

    setRows(rows) {
        this.rows = rows;
        this.destroy();
        this.setPages(this.calculatePages());
        this.createTable();
    }

    addRow(row) {
        this.rows = [...this.rows, row];
        this.copyRows = [...this.copyRows, row];
        this.destroy();
        this.setPages(this.calculatePages());
        this.createTable();
    }

    addRowAtStart(row) {
        this.rows = [row, ...this.rows];
        this.copyRows = [row, ...this.copyRows];
        this.destroy();
        this.setPages(this.calculatePages());
        this.createTable();
    }

    updateRow(updateRow) {
        this.rows = this.rows.map((row) => (row.id === updateRow.id ? updateRow : row));
        this.copyRows = this.copyRows.map((row) => (row.id === updateRow.id ? updateRow : row));
        this.destroy();
        this.setPages(this.calculatePages());
        this.createTable();
    }

    deleteRow(deleteRow) {
        this.rows = this.rows.filter((row) => row.id !== deleteRow.id);
        this.copyRows = this.copyRows.filter((row) => row.id !== deleteRow.id);
        this.clearSelectedRows();
        this.setPages(this.calculatePages());
        this.checkPage();
        this.destroy();
        this.createTable();
    }

    deleteRows(deleteRows) {
        this.rows = this.rows.filter((row) => !deleteRows.some((deleteRow) => deleteRow.id === row.id));
        this.copyRows = this.copyRows.filter((row) => !deleteRows.some((deleteRow) => deleteRow.id === row.id));
        this.clearSelectedRows();
        this.setPages(this.calculatePages());
        this.checkPage();
        this.destroy();
        this.createTable();
    }

    searchRow(search) {
        this.rows = this.copyRows.filter((row) => {
            const fields = this.findFields ? this.findFields : Object.keys(row);

            const value = fields.reduce((previousValue, currentValue, currentIndex) => {
                return !currentIndex ? row[currentValue] : previousValue + " " + row[currentValue];
            }, "");

            const valueNormalized = value
                .toString()
                .toLowerCase()
                .trim()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ");

            const searchParts = search
                .toLowerCase()
                .normalize("NFD")
                .trim()
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, " ")
                .split(" ");

            const bool = searchParts.every((searchPart) => {
                return valueNormalized.includes(searchPart);
            });

            return bool;
        });

        this.clearSelectedRows();
        this.setPages(this.calculatePages());
        this.checkPage();
        this.destroy();
        this.createTable();
    }

    checkPage() {
        if (this.page > this.pages) {
            this.page = this.pages;
        }
    }

    setPages(pages) {
        this.pages = pages;
    }

    calculatePages() {
        return Math.ceil(this.rows.length / this.rowsPerPage) || 1;
    }

    clearSelectedRows() {
        this.selectedRows = [];
    }

    createTable() {
        this.table = document.createElement("div");
        this.table.classList.add("table");
        this.table.style.height = this.tableSizing().tableHeight + "px";
        this.container.appendChild(this.table);

        const tableWrapper = document.createElement("div");
        tableWrapper.style.height = this.tableSizing().wrapperHeight + "px";
        tableWrapper.classList.add("wrapper");
        this.table.appendChild(tableWrapper);

        const table = document.createElement("table");
        tableWrapper.appendChild(table);

        const thead = this.createThead();
        table.appendChild(thead);

        const tbody = this.createTbody();
        table.appendChild(tbody);

        const footer = this.createFooter();
        this.table.appendChild(footer);
    }

    tableSizing() {
        const rowHeight = 52;
        const headerHeight = 56;
        const footerHeight = 56;

        let tableHeight = 0;
        let wrapperHeight = 0;

        if (this.visibleRows > this.rowsPerPage) {
            wrapperHeight = rowHeight * this.rowsPerPage + rowHeight / 2 + headerHeight;
            tableHeight = wrapperHeight + footerHeight;
        }
        if (this.visibleRows <= this.rowsPerPage) {
            wrapperHeight = rowHeight * this.visibleRows + rowHeight / 2 + headerHeight;
            tableHeight = wrapperHeight + footerHeight;
        }

        return {
            wrapperHeight,
            tableHeight,
        };
    }

    createThead() {
        const thead = document.createElement("thead");

        const tr = document.createElement("tr");
        thead.appendChild(tr);

        const thCheckAll = document.createElement("th");
        tr.appendChild(thCheckAll);

        const label = document.createElement("label");
        thCheckAll.appendChild(label);

        const input = document.createElement("input");
        input.type = "checkbox";
        if (this.selectedRows.length && this.selectedRows.length === this.rows.length) {
            input.checked = true;
        }
        input.addEventListener("change", this.handleCheckAll.bind(this));
        label.appendChild(input);

        this.columns.forEach((column) => {
            const th = document.createElement("th");
            tr.appendChild(th);

            const button = document.createElement("button");
            button.type = "button";
            button.ariaLabel = "Ordenar";
            button.addEventListener("click", this.handleSort.bind(this, column));
            th.appendChild(button);

            const name = document.createElement("div");
            name.classList.add("name");
            name.textContent = column.headerName;
            button.appendChild(name);

            const sort = document.createElement("div");
            sort.classList.add("sort", "asc");
            if (this.sortColumn === column && this.sort) {
                sort.classList.remove("asc");
                sort.classList.add("asc");
            }
            if (this.sortColumn === column && !this.sort) {
                sort.classList.remove("asc");
                sort.classList.add("desc");
            }
            button.appendChild(sort);

            const sortIcon = icon.get("arrowUpShort");
            sort.appendChild(sortIcon);
        });

        this.customColumns.forEach((column) => {
            const th = document.createElement("th");
            tr.appendChild(th);

            const button = document.createElement("button");
            button.type = "button";
            button.ariaLabel = "Ordenar";
            button.addEventListener("click", this.handleSort.bind(this, column));
            th.appendChild(button);

            const name = document.createElement("div");
            name.classList.add("name");
            name.textContent = column.headerName;
            button.appendChild(name);

            const sort = document.createElement("div");
            sort.classList.add("sort", "asc");
            if (this.sortColumn === column && this.sort) {
                sort.classList.remove("asc");
                sort.classList.add("asc");
            }
            if (this.sortColumn === column && !this.sort) {
                sort.classList.remove("asc");
                sort.classList.add("desc");
            }
            button.appendChild(sort);

            const sortIcon = icon.get("arrowUpShort");
            sort.appendChild(sortIcon);
        });

        const thActions = document.createElement("th");
        thActions.textContent = "Acciones";
        tr.appendChild(thActions);

        return thead;
    }

    createTbody() {
        const tbody = document.createElement("tbody");

        this.rows.forEach((row, index) => {
            if (index < this.rowsPerPage * (this.page - 1) || index >= this.rowsPerPage * this.page) {
                return;
            }

            const tr = document.createElement("tr");
            const exists = this.selectedRows.some((selectedRow) => selectedRow === row);
            if (exists) {
                tr.classList.add("selected");
            }
            tr.addEventListener("click", this.handleRowClick.bind(this, row));
            tbody.appendChild(tr);

            const tdCheck = document.createElement("td");
            tr.appendChild(tdCheck);

            const label = document.createElement("label");
            tdCheck.appendChild(label);

            const input = document.createElement("input");
            input.type = "checkbox";
            if (exists) {
                input.checked = true;
            }
            input.addEventListener("change", this.handleCheck.bind(this, row));
            input.addEventListener("click", (e) => e.stopPropagation());
            label.appendChild(input);

            this.columns.forEach((column) => {
                const td = document.createElement("td");
                td.textContent = row[column.field];
                tr.appendChild(td);
            });

            this.customColumns.forEach((column) => {
                const td = document.createElement("td");
                tr.appendChild(td);

                const content = column.content(row);
                td.appendChild(content);
            });

            const tdActions = document.createElement("td");
            tdActions.classList.add("actions");
            tr.appendChild(tdActions);

            const actionsContainer = document.createElement("div");
            tdActions.appendChild(actionsContainer);

            if (this.showActionsMenu) {
                const menuButton = new IconButton({
                    ariaLabel: "Menu Acciones",
                    buttonSize: "medium",
                    svgSize: "medium",
                    icon: icon.get("threeDotsVertical"),
                    callback: (e) => {
                        e.stopPropagation();
                    },
                });
                actionsContainer.appendChild(menuButton.get());

                let items = [];
                this.extraActions.forEach((action) => {
                    items.push({
                        type: "button",
                        text: action.name,
                        ariaLabel: action.name,
                        icon: action.icon,
                        onClick: () => action.callback(row),
                    });
                });

                const menu = new Menu({
                    target: menuButton.get(),
                    items: [
                        {
                            type: "button",
                            text: "Editar",
                            ariaLabel: "Editar",
                            icon: icon.get("pencilSquare"),
                            onClick: this.handleUpdate.bind(this, row),
                        },
                        {
                            type: "button",
                            text: "Eliminar",
                            ariaLabel: "Editar",
                            icon: icon.get("trash"),
                            onClick: this.handleDelete.bind(this, row),
                        },
                        ...items,
                    ],
                });
            } else {
                const editButton = new IconButton({
                    ariaLabel: "Editar",
                    buttonSize: "medium",
                    svgSize: "medium",
                    icon: icon.get("pencilSquare"),
                    callback: this.handleUpdate.bind(this, row),
                });
                actionsContainer.appendChild(editButton.get());

                const deleteButton = new IconButton({
                    ariaLabel: "Eliminar",
                    buttonSize: "medium",
                    svgSize: "medium",
                    icon: icon.get("trash"),
                    callback: this.handleDelete.bind(this, row),
                });
                actionsContainer.appendChild(deleteButton.get());

                this.extraActions.forEach((action) => {
                    const button = new IconButton({
                        ariaLabel: action.ariaLabel,
                        buttonSize: "medium",
                        svgSize: "medium",
                        icon: action.icon.cloneNode(true),
                        callback: (e) => {
                            e.stopPropagation();
                            action.callback(row);
                        },
                    });
                    actionsContainer.appendChild(button.get());
                });
            }
        });

        return tbody;
    }

    createFooter() {
        const footer = document.createElement("div");
        footer.classList.add("footer");

        const colLeft = document.createElement("div");
        colLeft.classList.add("col-left");
        footer.appendChild(colLeft);

        const selectedRows = document.createElement("div");
        selectedRows.classList.add("selected-rows");
        if (this.selectedRows.length && this.selectedRows.length === 1) {
            selectedRows.textContent = "1 fila seleccionada";
        }
        if (this.selectedRows.length && this.selectedRows.length > 1) {
            selectedRows.textContent = this.selectedRows.length + " filas seleccionadas";
        }
        colLeft.appendChild(selectedRows);

        if (this.selectedRows.length) {
            const deleteSelectedButton = document.createElement("button");
            deleteSelectedButton.type = "button";
            deleteSelectedButton.ariaLabel = "Eliminar seleccionadas";
            deleteSelectedButton.addEventListener("click", this.handleDeleteSelected.bind(this));
            colLeft.appendChild(deleteSelectedButton);

            const deleteSelectedIcon = icon.get("trash");
            deleteSelectedButton.appendChild(deleteSelectedIcon);

            this.extraActionsMultipleSelect.forEach((action) => {
                const button = document.createElement("button");
                button.type = "button";
                button.ariaLabel = action.name;
                button.addEventListener("click", action.callback.bind(this, this.selectedRows));
                colLeft.appendChild(button);

                button.appendChild(action.icon);
            });
        }

        const colRight = document.createElement("div");
        colRight.classList.add("col-right");
        footer.appendChild(colRight);

        const rows = document.createElement("div");
        rows.classList.add("rows");
        let text = "";
        if (this.rows.length) {
            text += (this.page - 1) * this.rowsPerPage + 1 + "-";
        } else {
            text += "0-";
        }
        if (this.page * this.rowsPerPage > this.rows.length) {
            text += this.rows.length + " de " + this.rows.length;
        } else {
            text += this.page * this.rowsPerPage + " de " + this.rows.length;
        }
        rows.textContent = text;
        colRight.appendChild(rows);

        const pagination = document.createElement("div");
        pagination.classList.add("pagination");
        colRight.appendChild(pagination);

        const prev = document.createElement("button");
        prev.type = "button";
        prev.ariaLabel = "Anterior";
        if (this.page <= 1) {
            prev.disabled = true;
        }
        prev.addEventListener("click", this.handlePrev.bind(this));
        pagination.appendChild(prev);

        const prevIcon = icon.get("chevronLeft");
        prev.appendChild(prevIcon);

        const next = document.createElement("button");
        next.type = "button";
        next.ariaLabel = "Siguiente";
        if (this.page >= this.pages) {
            next.disabled = true;
        }
        next.addEventListener("click", this.handleNext.bind(this));
        pagination.appendChild(next);

        const nextIcon = icon.get("chevronRight");
        next.appendChild(nextIcon);

        return footer;
    }

    handleCheckAll(e) {
        const checkbox = e.currentTarget;
        const checked = checkbox.checked;

        const tableRows = this.table.querySelectorAll("tbody tr");
        tableRows.forEach((tableRow) => {
            const checkbox = tableRow.querySelector("input[type=checkbox]");
            checkbox.checked = checked;

            if (checked) {
                tableRow.classList.add("selected");
            } else {
                tableRow.classList.remove("selected");
            }
        });

        this.selectedRows = checked ? this.rows : [];
        this.destroy();
        this.createTable();
    }

    handleSort(column, e) {
        const target = e.currentTarget;

        if (this.sortColumn === column) {
            this.sort = !this.sort;
        } else {
            this.sort = true;
            this.sortColumn = column;
        }

        this.rows.sort((a, b) => {
            const aValue = a[column.field];
            const bValue = b[column.field];

            if (this.sort) {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.destroy();
        this.createTable();
    }

    handleCheck(row, e) {
        const checkbox = e.currentTarget;
        const checked = checkbox.checked;

        const tableRow = checkbox.parentNode.parentNode.parentNode;
        tableRow.classList.toggle("selected");

        if (checked) {
            this.selectedRows = [...this.selectedRows, row];
        } else {
            this.selectedRows = this.selectedRows.filter((selectedRow) => selectedRow !== row);
        }
        this.destroy();
        this.createTable();
    }

    handleRowClick(row, e) {
        const tableRow = e.currentTarget;
        tableRow.classList.toggle("selected");

        const checkbox = tableRow.querySelector("input[type=checkbox]");
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            this.selectedRows = [...this.selectedRows, row];
        } else {
            this.selectedRows = this.selectedRows.filter((selectedRow) => selectedRow !== row);
        }
        this.destroy();
        this.createTable();
    }

    handleUpdate(row, e) {
        e.stopPropagation();
        this.update(row);
    }

    handleDelete(row, e) {
        e.stopPropagation();
        this.delete(row);
    }

    handleDeleteSelected(e) {
        e.stopPropagation();
        this.deleteSelected(this.selectedRows);
    }

    handlePrev() {
        this.page--;
        this.destroy();
        this.createTable();
    }

    handleNext() {
        this.page++;
        this.destroy();
        this.createTable();
    }

    repaint(rows) {
        this.rows = rows;
        this.copyRows = rows;
        this.destroy();
        this.createTable();
    }

    destroy() {
        this.table.remove();
    }
}

export default Table;
