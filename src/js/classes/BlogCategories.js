import { popup, api } from "../app.js";
import Table from "./Table.js";
import Modal from "./Modal.js";
import Confirm from "./Confirm.js";
import Input from "./mio/Input.js";
import { icon } from "../modules/Icon.js";
import { toSeoUrl } from "../helpers.js";

class BlogCategories {
    constructor() {
        this.categories = [];
        this.category = null;

        this.values = {
            name: "",
            alias: "",
        };
        this.errors = null;

        this.columns = [
            { field: "id", headerName: "Id" },
            { field: "name", headerName: "Nombre" },
            { field: "alias", headerName: "Alias" },
        ];

        this.init();
    }

    async init() {
        const blogCategories = document.querySelector("#blog-categories");
        const blogCategoriesTable = document.querySelector("#blog-categories-table");
        const blogCategoriesSearch = document.querySelector("#blog-categories-search");

        if (blogCategories) {
            await this.readCategoriesInUse();
            this.showCategoriesInUse();
        }

        if (blogCategoriesTable) {
            await this.readAllCategories();
            this.showCategoriesTable();

            const createCategory = document.querySelector("#blog-categories-create");
            createCategory.addEventListener("click", this.handleCreateCategory.bind(this));
        }

        if (blogCategoriesSearch) {
            this.createSearch();
        }
    }

    async readCategoriesInUse() {
        const response = await api.get("/api/blog/categories");
        if (response.status === "error") {
            return;
        }
        this.categories = response.categories;
    }

    async readAllCategories() {
        const response = await api.get("/api/admin/blog-categories");
        if (response.status === "error") {
            return;
        }
        this.categories = response.categories;
    }

    resetValues() {
        this.values = {
            name: "",
            alias: "",
        };
    }

    handleCreateCategory() {
        this.modal = new Modal({
            title: "Crear categoría",
            content: this.createCategoryForm(),
            action: "Crear",
            actionCallback: () => this.createCategory(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async createCategory() {
        const response = await api.post("/api/admin/blog-categories", this.values);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createCategoryForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Categoría creada!`,
            message: "La categoría ha sido creada correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.addRow(response.category);
    }

    handleUpdateCategory(category) {
        this.category = category;
        this.values = {
            name: category.name,
            alias: category.alias,
        };

        this.modal = new Modal({
            title: "Actualizar categoría",
            content: this.createCategoryForm(),
            action: "Actualizar",
            actionCallback: () => this.updateCategory(),
            closeCallback: () => {
                this.resetValues();
                this.errors = null;
            },
        });
    }

    async updateCategory() {
        this.category = {
            id: this.category.id,
            name: this.values.name,
            alias: this.values.alias,
        };

        const response = await api.put("/api/admin/blog-categories", this.category);

        if (response.status === "error") {
            this.errors = response.errors;
            this.modal.repaint(this.createCategoryForm());
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Categoría actualizada!`,
            message: "La categoría ha sido actualziada correctamente.",
            timer: 3000,
        });

        await this.modal.close();

        this.table.updateRow(response.category);
    }

    async deleteCategory(category) {
        const confirm = new Confirm({
            title: "¿Eliminar categoría?",
            description:
                "¿Estás seguro de eliminar esta categoría? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const data = {
            id: category.id,
        };

        const response = await api.delete("/api/admin/blog-categories", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Categoría eliminada!",
            message: "La categoría ha sido eliminada correctamente.",
            timer: 3000,
        });

        this.table.deleteRow(category);
    }

    async deleteCategories(selectedCategories) {
        const confirm = new Confirm({
            title: `¿Eliminar ${selectedCategories.length > 1 ? "categorías" : "categoría"}?`,
            description: `¿Estás seguro de eliminar  ${
                selectedCategories.length > 1 ? "estas categorías" : "esta categoría"
            }? Los datos no podrán ser recuperados.`,
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();

        if (!confirmResponse) {
            return;
        }

        const response = await api.delete(
            "/api/admin/blog-categories/multiple",
            selectedCategories
        );

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: `¡${
                selectedCategories.length > 1 ? "Categorías eliminadas" : "Categoría eliminada"
            }!`,
            message: `${
                selectedCategories.length > 1
                    ? "Las categorías han sido eliminadas"
                    : "La categoría ha sido eliminada"
            } correctamente!`,
            timer: 3000,
        });

        this.table.deleteRows(selectedCategories);
    }

    createSearch() {
        const form = document.querySelector("#blog-categories-search");
        form.addEventListener("keyup", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar categoría",
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

    createCategoryForm() {
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
                this.values.alias = toSeoUrl(value);
                this.errors = null;
                alias.setValue(this.values.alias);
            },
        });

        const nameField = name.getField();
        form.appendChild(nameField);

        const alias = new Input({
            label: {
                text: "Alias",
                for: "alias",
            },
            input: {
                type: "text",
                name: "alias",
                id: "alias",
                value: this.values ? this.values.alias : "",
            },
            error: this.errors && this.errors.alias,
            message: this.errors && this.errors.alias ? this.errors.alias : "",
        });

        const aliasField = alias.getField();
        form.appendChild(aliasField);

        return form;
    }

    showCategoriesInUse() {
        const categoriesContainer = document.querySelector("#blog-categories");
        const categoriesElements = this.createCategoriesFragment();
        categoriesContainer.appendChild(categoriesElements);
    }

    showCategoriesTable() {
        const categoriesContainer = document.querySelector("#blog-categories-table");

        this.table = new Table({
            columns: this.columns,
            rows: this.categories,
            container: categoriesContainer,
            visibleRows: 10,
            rowsPerPage: 15,
            update: this.handleUpdateCategory.bind(this),
            delete: this.deleteCategory.bind(this),
            deleteSelected: this.deleteCategories.bind(this),
        });
    }

    createCategoriesFragment() {
        const fragment = document.createDocumentFragment();

        this.categories.forEach((category) => {
            const categoryElement = this.createCategoryElement(category);
            fragment.appendChild(categoryElement);
        });

        return fragment;
    }

    createCategoryElement(category) {
        const anchor = document.createElement("a");
        anchor.href = `/blog/${category.alias}`;

        const span = document.createElement("span");
        span.textContent = category.name;
        anchor.appendChild(span);

        const arrowRight = icon.get("arrowRight");
        anchor.appendChild(arrowRight);

        return anchor;
    }
}

export default BlogCategories;
