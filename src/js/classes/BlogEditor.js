import { BlogUploadAdapter } from "./UploadAdapter.js";
import { popup, api } from "../app.js";
import { icon } from "../modules/Icon.js";
import Input from "./mio/Input.js";
import Textarea from "./mio/Textarea.js";
import Select from "./mio/Select.js";
import InputFile from "./InputFile.js";

class BlogEditor {
    constructor() {
        this.post = null;
        this.categories = [];

        this.values = {
            title: "",
            description: "",
            category_id: "",
            alt: "",
            html: "",
        };
        this.errors = null;

        this.init();
    }

    async init() {
        const blogEditor = document.querySelector("#blog-editor");

        if (!blogEditor) {
            return;
        }

        await this.loadCKEditor();
        await this.readAllCategories();
        await this.loadPost();
        this.createEditorForm();
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

    async createCKEditor(html) {
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
                extraPlugins: [BlogUploadAdapter],
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
        const response = await api.get("/api/admin/blog-categories");
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

        const response = await api.get(`/api/editor/blog/read/${post_id}`);
        if (response.status === "error") {
            return;
        }

        this.post = response.post;

        this.values = {
            title: this.post.title,
            description: this.post.description,
            category_id: this.post.category_id,
            alt: this.post.alt,
            html: this.post.html,
        };
    }

    async createEditorForm() {
        const blogEditor = document.querySelector("#blog-editor");

        this.formEditor = document.createElement("form");
        this.formEditor.classList.add("mio-form");
        this.formEditor.addEventListener("submit", this.handleSubmit.bind(this));
        blogEditor.appendChild(this.formEditor);

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
                maxlength: 255,
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
                maxlength: 255,
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

        const colImage = document.createElement("div");
        colImage.classList.add("col");
        this.formEditor.appendChild(colImage);

        const h2Image = document.createElement("h2");
        h2Image.textContent = "4. Imagen miniatura";
        colImage.appendChild(h2Image);

        const pImage = document.createElement("p");
        pImage.textContent = "Imagen para las miniaturas. Recomendado 750px por 500px";
        colImage.appendChild(pImage);

        if (this.inputFile && this.inputFile.getInput().files.length) {
            colImage.appendChild(this.inputFile.getField());
        } else {
            this.inputFile = new InputFile({
                label: {
                    text: "Selecciona una imagen...",
                    for: "image",
                },
                input: {
                    name: "image",
                    id: "image",
                    accept: "image/jpeg, image/png",
                },
                error: this.errors && this.errors.image ? this.errors.image : "",
                callback: (src) => {
                    this.previewImage(src);
                },
            });
            colImage.appendChild(this.inputFile.getField());
        }
        
        if (this.post) {
            const src = this.post.src;
            this.previewImage(src);
        }

        const colAlt = document.createElement("div");
        colAlt.classList.add("col");
        this.formEditor.appendChild(colAlt);

        const h2Alt = document.createElement("h2");
        h2Alt.textContent = "5. Descripción imagen";
        colAlt.appendChild(h2Alt);

        const pAlt = document.createElement("p");
        pAlt.textContent = "Descripción para imagen principal. Máximo 255 caracteres";
        colAlt.appendChild(pAlt);

        const alt = new Textarea({
            label: {
                text: "Descripción imagen",
                for: "alt",
            },
            input: {
                name: "alt",
                id: "alt",
                rows: 2,
                maxlength: 255,
                value: this.values.alt,
            },
            error: this.errors && this.errors.alt,
            message: this.errors && this.errors.alt ? this.errors.alt : "",
            callback: () => {
                this.errors = null;
            },
        });
        colAlt.appendChild(alt.getField());

        const colHTML = document.createElement("div");
        colHTML.classList.add("col");
        this.formEditor.appendChild(colHTML);

        const h2HTML = document.createElement("h2");
        h2HTML.textContent = "6. Contenido";
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

        if (this.errors && this.errors.html) {
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

    async handleSubmit(e) {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        data.append("html", this.editor.getData());
        if (this.post) {
            data.append("id", this.post.id);
        }

        const response = await api.post(
            `/api/editor/blog/${this.post ? "update" : "create"}`,
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
            message: "Serás redirigido al blog",
            timer: 3000,
        });

        window.location.href = "/blog";
    }

    async previewImage(src) {
        const imageInput = document.querySelector("#image");
        const imageLabel = document.querySelector("label[for='image']");

        imageLabel.classList.add("hidden");

        const preview = document.createElement("div");
        preview.classList.add("image-preview");
        imageInput.parentElement.appendChild(preview);

        const image = await this.createImage(src);
        preview.appendChild(image);

        const closeButton = document.createElement("button");
        closeButton.classList.add("close");
        closeButton.type = "button";
        closeButton.addEventListener("click", () => {
            imageInput.value = "";
            imageLabel.classList.remove("hidden");
            preview.remove();
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
}

export default BlogEditor;
