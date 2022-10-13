import { CasesUploadAdapter } from "./UploadAdapter.js";
import { popup, api } from "../app.js";
import { icon } from "../modules/Icon.js";
import BeforeAndAfter from "./BeforeAndAfter.js";
import Input from "./mio/Input.js";
import Textarea from "./mio/Textarea.js";
import Select from "./mio/Select.js";
import InputFile from "./InputFile.js";

class CasesEditor {
    constructor() {
        this.post = null;
        this.categories = [];

        this.values = {
            title: "",
            description: "",
            category_id: "",
            before_alt: "",
            after_alt: "",
            html: "",
        };
        this.errors = null;

        this.previewBAF = false;
        this.before = false;
        this.after = false;

        this.init();
    }

    async init() {
        const casesEditor = document.querySelector("#cases-editor");

        if (!casesEditor) {
            return;
        }

        await this.loadCKEditor();
        await this.readAllCategories();
        await this.loadPost();
        this.createEditorForm();
        this.setFormEditorValues();
    }

    async loadCKEditor() {
        const script = document.querySelector(
            'script[src="/build/js/vendor/ckeditor/ckeditor.js"]'
        );
        if (script) {
            return;
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "/build/js/vendor/ckeditor/ckeditor.js";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    createCKEditor() {
        return new Promise((resolve, reject) => {
            ClassicEditor.create(html, {
                image: {
                    toolbar: [
                        "imageStyle:inline",
                        "imageStyle:wrapText",
                        "imageStyle:breakText",
                        "|",
                        "toggleImageCaption",
                        "imageTextAlternative",
                    ],
                },
                extraPlugins: [CasesUploadAdapter],
            })
                .then((editor) => {
                    this.editor = editor;
                    if (this.values.html) {
                        this.editor.setData(this.values.html);
                    }
                    resolve();
                })
                .catch((error) => {
                    console.log(error);
                    reject();
                });
        });
    }

    async readAllCategories() {
        const response = await api.get("/api/admin/cases-categories");
        if (response.status === "error") {
            return;
        }
        this.categories = response.categories;
    }

    async loadPost() {
        const url = window.location.pathname;
        const urlArray = url.split("/").filter((item) => item);

        if (urlArray.length === 2) {
            return;
        }

        const post_id = urlArray[2];

        const response = await api.get(`/api/editor/cases/read/${post_id}`);

        if (response.status === "error") {
            return;
        }

        this.post = response.post;

        this.values = {
            title: this.post.title,
            description: this.post.description,
            category_id: this.post.category_id,
            before_alt: this.post.images.before.alt,
            after_alt: this.post.images.after.alt,
            html: this.post.html,
        };
    }

    async createEditorForm() {
        const casesEditor = document.querySelector("#cases-editor");

        this.formEditor = document.createElement("form");
        this.formEditor.classList.add("mio-form");
        this.formEditor.addEventListener("input", (e) => this.handleInput(e));
        this.formEditor.addEventListener("submit", this.handleSubmit.bind(this));
        casesEditor.appendChild(this.formEditor);

        const colTitle = document.createElement("div");
        colTitle.classList.add("col");
        this.formEditor.appendChild(colTitle);

        const h2Title = document.createElement("h2");
        h2Title.textContent = "1. Título";
        colTitle.appendChild(h2Title);

        const pTitle = document.createElement("p");
        pTitle.textContent = "Máximo 255 caracteres";
        colTitle.appendChild(pTitle);

        const title = new Input({
            label: {
                text: "Título",
                for: "title",
            },
            input: {
                type: "text",
                name: "title",
                id: "title",
                value: this.values.title,
            },
            error: this.errors && this.errors.title,
            message: this.errors && this.errors.title ? this.errors.title : "",
            callback: (value) => {
                this.values.title = value;
                this.errors = null;
            },
        });
        colTitle.appendChild(title.getField());

        const colDescription = document.createElement("div");
        colDescription.classList.add("col");
        this.formEditor.appendChild(colDescription);

        const h2Description = document.createElement("h2");
        h2Description.textContent = "2. Descripción";
        colDescription.appendChild(h2Description);

        const pDescription = document.createElement("p");
        pDescription.textContent = "Máximo 255 caracteres";
        colDescription.appendChild(pDescription);

        const description = new Textarea({
            label: {
                text: "Descripción",
                for: "description",
            },
            input: {
                name: "description",
                id: "description",
                rows: 2,
                value: this.values.description,
            },
            error: this.errors && this.errors.description,
            message: this.errors && this.errors.description ? this.errors.description : "",
            callback: (value) => {
                this.values.description = value;
                this.errors = null;
            },
        });
        colDescription.appendChild(description.getField());

        const colCategory = document.createElement("div");
        colCategory.classList.add("col");
        this.formEditor.appendChild(colCategory);

        const h2Category = document.createElement("h2");
        h2Category.textContent = "3. Categoría";
        colCategory.appendChild(h2Category);

        const pCategory = document.createElement("p");
        pCategory.textContent = "Seleccionar la categoría a la que corresponde el post";
        colCategory.appendChild(pCategory);

        const category = new Select({
            label: {
                text: "Categoría",
                for: "category_id",
            },
            select: {
                name: "category_id",
                id: "category_id",
            },
            option: {
                value: "id",
                text: "name",
            },
            options: this.categories,
            selected: this.values.category_id ? { id: this.values.category_id } : null,
            error: this.errors && this.errors.category_id,
            message: this.errors && this.errors.category_id ? this.errors.category_id : "",
            onSelect: (option) => {
                this.values.category_id = option.id;
                this.errors = null;
            },
        });
        colCategory.appendChild(category.getField());

        const imagesRow = document.createElement("div");
        imagesRow.classList.add("row");
        this.formEditor.appendChild(imagesRow);

        const colImageBefore = document.createElement("div");
        colImageBefore.classList.add("col");
        imagesRow.appendChild(colImageBefore);

        const h2ImageBefore = document.createElement("h2");
        h2ImageBefore.textContent = "4. Imagen antes";
        colImageBefore.appendChild(h2ImageBefore);

        const pImageBefore = document.createElement("p");
        pImageBefore.textContent = "Imagen antes. Recomendado 750px por 500px";
        colImageBefore.appendChild(pImageBefore);

        if (this.inputFileAfter && this.inputFileAfter.getInput().files.length) {
            colImageBefore.appendChild(this.inputFileAfter.getField());
        } else {
            this.inputFileAfter = new InputFile({
                label: {
                    text: "Selecciona una imagen...",
                    for: "before",
                },
                input: {
                    name: "before",
                    id: "before",
                    accept: "image/jpeg, image/png",
                },
                error: this.errors && this.errors.image ? this.errors.image : "",
                callback: (src) => {
                    const input = this.inputFileAfter.getInput();
                    const label = this.inputFileAfter.getLabel();
                    this.previewImage(input, label, src);
                },
            });
            colImageBefore.appendChild(this.inputFileAfter.getField());
        }

        const colImageAfter = document.createElement("div");
        colImageAfter.classList.add("col");
        imagesRow.appendChild(colImageAfter);

        const h2ImageAfter = document.createElement("h2");
        h2ImageAfter.textContent = "5. Imagen después";
        colImageAfter.appendChild(h2ImageAfter);

        const pImageAfter = document.createElement("p");
        pImageAfter.textContent = "Imagen después. Recomendado 750px por 500px";
        colImageAfter.appendChild(pImageAfter);

        if (this.inputFileBefore && this.inputFileBefore.getInput().files.length) {
            colImageAfter.appendChild(this.inputFileBefore.getField());
        } else {
            this.inputFileBefore = new InputFile({
                label: {
                    text: "Selecciona una imagen...",
                    for: "after",
                },
                input: {
                    name: "after",
                    id: "after",
                    accept: "image/jpeg, image/png",
                },
                error: this.errors && this.errors.image ? this.errors.image : "",
                callback: (src) => {
                    const input = this.inputFileBefore.getInput();
                    const label = this.inputFileBefore.getLabel();
                    this.previewImage(input, label, src);
                },
            });
            colImageAfter.appendChild(this.inputFileBefore.getField());
        }

        const imagesDescriptionRow = document.createElement("div");
        imagesDescriptionRow.classList.add("row");
        this.formEditor.appendChild(imagesDescriptionRow);

        const colBeforeAlt = document.createElement("div");
        colBeforeAlt.classList.add("before-alt");
        imagesDescriptionRow.appendChild(colBeforeAlt);

        const h2BeforeAlt = document.createElement("h2");
        h2BeforeAlt.textContent = "6. Descripción imagen antes";
        colBeforeAlt.appendChild(h2BeforeAlt);

        const pBeforeAlt = document.createElement("p");
        pBeforeAlt.textContent = "Descripción para imagen antes. Máximo 255 caracteres";
        colBeforeAlt.appendChild(pBeforeAlt);

        const beforeAlt = new Textarea({
            label: {
                text: "Descripción imagen antes",
                for: "before-alt",
            },
            input: {
                name: "before-alt",
                id: "before-alt",
                rows: 2,
                value: this.values.before_alt,
            },
            error: this.errors && this.errors.before_alt,
            message: this.errors && this.errors.before_alt ? this.errors.before_alt : "",
            callback: () => {
                this.errors = null;
            },
        });
        colBeforeAlt.appendChild(beforeAlt.getField());

        const colAfterAlt = document.createElement("div");
        colAfterAlt.classList.add("before-alt");
        imagesDescriptionRow.appendChild(colAfterAlt);

        const h2AfterAlt = document.createElement("h2");
        h2AfterAlt.textContent = "7. Descripción imagen después";
        colAfterAlt.appendChild(h2AfterAlt);

        const pAfterAlt = document.createElement("p");
        pAfterAlt.textContent = "Descripción para imagen después. Máximo 255 caracteres";
        colAfterAlt.appendChild(pAfterAlt);

        const afterAlt = new Textarea({
            label: {
                text: "Descripción imagen después",
                for: "after-alt",
            },
            input: {
                name: "after-alt",
                id: "after-alt",
                rows: 2,
                value: this.values.after_alt,
            },
            error: this.errors && this.errors.after_alt,
            message: this.errors && this.errors.after_alt ? this.errors.after_alt : "",
            callback: () => {
                this.errors = null;
            },
        });
        colAfterAlt.appendChild(afterAlt.getField());

        const colPreview = document.createElement("div");
        colPreview.classList.add("col");
        this.formEditor.appendChild(colPreview);

        const h2Preview = document.createElement("h2");
        h2Preview.textContent = "8. Previsualización";
        colPreview.appendChild(h2Preview);

        const pPreview = document.createElement("p");
        pPreview.textContent = "Vista previa del deslizador antes y después";
        colPreview.appendChild(pPreview);

        const bafPreview = document.createElement("div");
        bafPreview.id = "baf-preview";
        bafPreview.classList.add("field", "baf-preview");
        colPreview.appendChild(bafPreview);

        const colHTML = document.createElement("div");
        colHTML.classList.add("col");
        this.formEditor.appendChild(colHTML);

        const h2HTML = document.createElement("h2");
        h2HTML.textContent = "9. Contenido";
        colHTML.appendChild(h2HTML);

        const pHTML = document.createElement("p");
        pHTML.textContent = "Contenido principal del post";
        colHTML.appendChild(pHTML);

        const fieldHTML = document.createElement("div");
        fieldHTML.classList.add("field");
        if (this.errors && this.errors.html) {
            fieldHTML.classList.add("error");
        }
        colHTML.appendChild(fieldHTML);

        const html = document.createElement("textarea");
        html.id = "html";
        html.name = "html";
        fieldHTML.appendChild(html);

        await this.createCKEditor(html);

        this.editor.model.document.on("change:data", () => {
            fieldHTML.classList.remove("error");
            if (fieldHTML.querySelector(".error-message")) {
                fieldHTML.querySelector(".error-message").remove();
            }
            this.values.html = this.editor.getData();
        });

        if (this.post) {
            this.editor.setData(this.values.html);
        }

        if (this.errors && this.errors.image) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = this.errors.html;
            fieldHTML.appendChild(errorMessage);
        }

        const submitField = document.createElement("div");
        submitField.classList.add("field");
        this.formEditor.appendChild(submitField);

        const submit = document.createElement("input");
        submit.type = "submit";
        submit.value = this.post ? "Actualizar post" : "Crear post";
        submit.classList.add("btn", "primary-btn");
        submitField.appendChild(submit);
    }

    async handleInput(e) {
        const targetInput = e.target;
        const beforeInput = document.querySelector("#before");
        const afterInput = document.querySelector("#after");

        this[targetInput.name] = true;

        if (beforeInput.value && afterInput.value && !this.previewBAF) {
            this.previewBAF = true;
            const beforFiles = beforeInput.files[0];
            const afterFiles = afterInput.files[0];

            const beforeSrc = URL.createObjectURL(beforFiles);
            const afterSrc = URL.createObjectURL(afterFiles);

            this.prevewBeforeAndAfter(beforeSrc, afterSrc);
            return;
        }

        if (this.isEdit() && this.before && this.after && !this.previewBAF) {
            this.previewBAF = true;

            if (targetInput.name === "before") {
                const afterSrc = this.post.images.after.src;
                const beforFiles = beforeInput.files[0];
                const beforeSrc = URL.createObjectURL(beforFiles);
                this.prevewBeforeAndAfter(beforeSrc, afterSrc);
            }

            if (targetInput.name === "after") {
                const beforeSrc = this.post.images.before.src;
                const afterFiles = afterInput.files[0];
                const afterSrc = URL.createObjectURL(afterFiles);
                this.prevewBeforeAndAfter(beforeSrc, afterSrc);
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        data.append("html", this.editor.getData());
        if (this.post) {
            data.append("id", this.post.id);
        }

        const response = await api.post(
            `/api/editor/cases/${this.post ? "update" : "create"}`,
            data
        );

        if (response.status === "error") {
            this.errors = response.errors;
            this.formEditor.remove();
            this.createEditorForm();
            return;
        }

        await popup.open({
            type: "success",
            title: `¡Post ${this.post ? "actualizado" : "creado"} correctamente!`,
            message: "Serás redirigido a los casos",
            timer: 3000,
        });

        window.location.href = "/casos";
    }

    setFormEditorValues() {
        if (!this.isEdit()) {
            return;
        }

        const beforeInput = document.querySelector("#before");
        const beforeLabel = document.querySelector("label[for='before']");
        const beforeSrc = this.post.images.before.src;
        this.before = true;

        this.previewImage(beforeInput, beforeLabel, beforeSrc);

        const afterInput = document.querySelector("#after");
        const afterLabel = document.querySelector("label[for='after']");
        const afterSrc = this.post.images.after.src;
        this.after = true;

        this.previewImage(afterInput, afterLabel, afterSrc);

        this.prevewBeforeAndAfter(beforeSrc, afterSrc);
    }

    async previewImage(input, label, src) {
        label.classList.add("hidden");

        const preview = document.createElement("div");
        preview.classList.add("image-preview");
        input.parentElement.appendChild(preview);

        const image = await this.createImage(src);
        preview.appendChild(image);

        const closeButton = document.createElement("button");
        closeButton.classList.add("close");
        closeButton.type = "button";
        closeButton.addEventListener("click", () => {
            input.value = "";
            label.classList.remove("hidden");

            preview.remove();
            if (this.beforeAndAfter) {
                this.beforeAndAfter.destroy();
            }

            this.previewBAF = false;
            this[input.name] = false;
        });
        preview.appendChild(closeButton);

        const closeIcon = icon.get("xLg");
        closeButton.appendChild(closeIcon);
    }

    createImage(src, alt = "") {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.src = src;
            image.alt = alt;

            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", () => reject(new Error("Error loading image")));
        });
    }

    async prevewBeforeAndAfter(beforeSrc, afterSrc) {
        const before = await this.createImage(beforeSrc);
        const after = await this.createImage(afterSrc);

        const preview = document.querySelector("#baf-preview");
        this.beforeAndAfter = new BeforeAndAfter(preview, before, after);
    }

    isEdit() {
        const url = window.location.pathname;
        const urlArray = url.split("/").filter((item) => item);
        return urlArray.length > 2 ? true : false;
    }
}

export default CasesEditor;
