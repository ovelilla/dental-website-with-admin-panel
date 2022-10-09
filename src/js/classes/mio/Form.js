class Form {
    constructor() {
        if (this.constructor === Form) {
            throw new TypeError("Abstract class 'Form' cannot be instantiated directly.");
        }

        window.addEventListener("load", () => {
            const autofilledInput = this.field.querySelector("input:-webkit-autofill");

            if (autofilledInput) {
                this.field.classList.add("active");
            }
        });
    }

    getField() {
        return this.field;
    }

    createField() {
        const field = document.createElement("div");
        field.classList.add("mio-field");
        if (this.input.value) {
            field.classList.add("active");
        }
        if (this.error) {
            field.classList.add("error");
        }

        return field;
    }

    createWrapper() {
        const wrapper = document.createElement("div");
        wrapper.classList.add("mio-wrapper");

        return wrapper;
    }

    createLabel() {
        const label = document.createElement("label");
        label.classList.add("mio-label");
        label.textContent = this.label.text;
        label.htmlFor = this.label.for;

        return label;
    }

    createAdornment() {
        const adornment = document.createElement("div");
        adornment.classList.add("mio-adornment");

        adornment.appendChild(this.adornment);

        return adornment;
    }

    createMessage() {
        if (!this.message) {
            return;
        }

        this.messageEl = document.createElement("div");
        this.messageEl.classList.add("mio-message");
        if (this.error) {
            this.messageEl.classList.add("mio-error");
        }
        this.messageEl.textContent = this.message;

        return this.messageEl;
    }

    removeMessage() {
        if (!this.messageEl) {
            return;
        }
        this.messageEl.remove();
        if (this.error) {
            this.field.classList.remove("error");
            this.messageEl.classList.remove("mio-error");
        }
    }

    setValue(value) {
        this.input.value = value;
        this.field.classList.add("active");
        this.removeMessage();
    }

    handleBlur(e) {
        if (!e.target.value) {
            this.field.classList.remove("active");
        }
        this.field.classList.remove("focus");
    }

    handleFocus() {
        this.field.classList.add("active");
        this.field.classList.add("focus");
    }

    handleInput(e) {
        this.removeMessage();

        if (this.callback) {
            this.callback(e.target.value);
        }
    }
}

export default Form;
