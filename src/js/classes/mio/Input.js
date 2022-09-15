import Form from "./Form.js";

class Input extends Form {
    constructor(data) {
        super(data);

        Object.assign(this, data);

        this.init();
    }

    init() {
        this.field = this.create();
    }

    create() {
        const field = this.createField();

        const wrapper = this.createWrapper();
        field.appendChild(wrapper);

        const label = this.createLabel();
        wrapper.appendChild(label);

        this.input = this.createInput();
        wrapper.appendChild(this.input);

        if (this.message) {
            const message = this.createMessage();
            field.appendChild(message);
        }

        if (this.adornment) {
            const adornment = this.createAdornment();
            wrapper.appendChild(adornment);
        }

        return field;
    }

    createInput() {
        const input = document.createElement("input");
        input.classList.add("mio-input");

        input.type = this.input.type;
        input.name = this.input.name;
        input.id = this.input.id;
        input.value = this.input.value ?? "";
        if (this.input.step) {
            input.step = this.step;
        }
        if (this.input.autocomplete) {
            input.autocomplete = this.input.autocomplete;
        }

        input.addEventListener("focus", this.handleFocus.bind(this));
        input.addEventListener("blur", this.handleBlur.bind(this));
        input.addEventListener("input", this.handleInput.bind(this));

        return input;
    }
}

export default Input;
