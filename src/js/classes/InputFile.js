class InputFile {
    constructor(data) {
        Object.assign(this, data);
        this.init();
    }

    init() {
        this.field = this.create();
    }

    getField() {
        return this.field;
    }

    getInput() {
        return this.inputEl;
    }

    getLabel() {
        return this.labelEl;
    }

    getSrc() {
        const file = this.inputEl.files[0];
        this.src = URL.createObjectURL(file);
        return this.src;
    }

    create() {
        const field = document.createElement("div");
        field.classList.add("field", "file");
        if (this.error) {
            field.classList.add("error");
        }

        this.labelEl = document.createElement("label");
        this.labelEl.htmlFor = this.label.for;
        field.appendChild(this.labelEl);

        const icon = this.createIcon();
        this.labelEl.appendChild(icon);

        const span = document.createElement("span");
        span.textContent = "Selecciona una imagen...";
        this.labelEl.appendChild(span);

        this.inputEl = document.createElement("input");
        this.inputEl.type = "file";
        this.inputEl.id = this.input.id;
        this.inputEl.name = this.input.name;
        this.inputEl.accept = this.input.accept;
        this.inputEl.addEventListener("change", () => {
            if (this.error) {
                field.classList.remove("error");
                this.errorEl.remove();
            }

            this.callback(this.getSrc());
        });
        field.appendChild(this.inputEl);

        if (this.error) {
            this.errorEl = document.createElement("p");
            this.errorEl.classList.add("error-message");
            this.errorEl.textContent = this.error;
            field.appendChild(this.errorEl);
        }

        return field;
    }

    createIcon() {
        const figure = document.createElement("figure");

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "17");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 20 17");
        figure.appendChild(svg);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
            "d",
            "M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
        );
        svg.appendChild(path);

        return figure;
    }
}

export default InputFile;
