class Form {
    constructor() {
        this.form = null;
        this.errors = [];

        this.init();
    }

    init() {
    //     this.forms = document.querySelectorAll("form");

    //     if (!this.forms.length) {
    //         return;
    //     }

    //     this.forms.forEach((form) => {
    //         form.addEventListener("focus", this.handleFocus.bind(this), true);
    //         form.addEventListener("blur", this.handleBlur.bind(this), true);
    //         form.addEventListener("input", this.handleInput.bind(this), true);

    //         form.querySelectorAll("input, textarea, select").forEach((field, index) => {
    //             if (index === 0) {
    //                 field.focus({
    //                     preventScroll: true,
    //                 });
    //             }
    //             if (field.value) {
    //                 field.dispatchEvent(new Event("focus"));
    //             }
    //         });
    //     });
    // }

    // handleFocus(e) {
    //     const field = e.target.closest(".field");

    //     field.classList.add("focus");
    // }

    // handleBlur(e) {
    //     const field = e.target.closest(".field");

    //     if (
    //         e.target.tagName !== "INPUT" &&
    //         e.target.tagName !== "TEXTAREA" &&
    //         e.target.tagName !== "SELECT"
    //     ) {
    //         return;
    //     }

    //     if (e.target.value.length === 0) {
    //         field.classList.remove("focus");
    //     }
    // }

    // handleInput(e) {
    //     const field = e.target.closest(".field");
    //     this.cleanError(field);
    // }

    // setErrors(errors) {
    //     this.errors = errors;
    // }

    // showErrors() {
    //     const form = document.querySelector("form:not(.search)");
    //     for (let [key, value] of Object.entries(this.errors)) {
    //         const field = form.querySelector(`[name="${key}"]`);
    //         field.parentElement.classList.add("error");

    //         const errorMessage = document.createElement("p");
    //         errorMessage.classList.add("error-message");
    //         errorMessage.textContent = value;
    //         field.parentElement.appendChild(errorMessage);
    //     }
    // }

    // cleanError(field) {
    //     field.classList.remove("error");
    //     field.querySelector(".error-message") && field.querySelector(".error-message").remove();

    //     if (field.classList.contains("ck")) {
    //         field.parentElement.parentElement.classList.remove("error");
    //         field.parentElement.parentElement.querySelector(".error-message") &&
    //             field.parentElement.parentElement.querySelector(".error-message").remove();
    //     }
    // }

    // cleanErrors() {
    //     const form = document.querySelector("form:not(.search)");
    //     const fields = form.querySelectorAll(".field");

    //     fields.forEach((field) => {
    //         field.classList.remove("error");
    //         field.querySelector(".error-message") && field.querySelector(".error-message").remove();
    //     });
    // }
    }
}

export default Form;
