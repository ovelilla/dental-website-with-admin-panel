import Form from "./Form.js";

class Checkbox extends Form {
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

        this.checkbox = this.createCheckbox();
        wrapper.appendChild(this.checkbox);

        const label = this.createLabel();
        wrapper.appendChild(label);

        if (this.message) {
            const message = this.createMessage();
            field.appendChild(message);
        }

        return field;
    }

    createCheckbox() {
        const input = document.createElement("input");
        input.classList.add("mio-checkbox-input");

        input.type = "checkbox";
        input.name = this.input.name;
        input.id = this.input.id;

        if (this.input.value) {
            input.checked = true;
        }

        input.addEventListener("change", () => {
            this.removeMessage();
            this.callback(input.checked);
        });

        return input;
    }

    createLabel() {
        const label = document.createElement("label");
        label.classList.add("mio-checkbox-label");
        label.textContent = this.label.text;
        label.htmlFor = this.label.for;

        return label;
    }
}

export default Checkbox;
