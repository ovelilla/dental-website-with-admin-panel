import { popup, form, api } from "../app.js";
import Input from "./mio/Input.js";

class User {
    constructor() {
        this.values = {
            email: "",
            password: "",
        };
        this.errors = null;

        this.init();
    }

    init() {
        const login = document.querySelector("#login");

        if (login) {
            this.createLoginForm();
        }

        const registerForm = document.querySelector("#register-form");

        if (registerForm) {
            registerForm.addEventListener("submit", this.register.bind(this));
        }

        const confirm = document.querySelector("#confirm");

        if (confirm) {
            confirm.addEventListener("click", this.confirm.bind(this));
        }

        const recoverForm = document.querySelector("#recover-form");

        if (recoverForm) {
            recoverForm.addEventListener("submit", this.recover.bind(this));
        }

        const restoreForm = document.querySelector("#restore-form");

        if (restoreForm) {
            restoreForm.addEventListener("submit", this.restore.bind(this));
        }
    }

    createLoginForm() {
        const login = document.querySelector("#login");

        this.loginForm = document.createElement("form");
        this.loginForm.classList.add("mio-form");
        this.loginForm.noValidate = true;
        this.loginForm.addEventListener("submit", this.login.bind(this));
        login.appendChild(this.loginForm);

        const email = new Input({
            label: {
                text: "Email",
                for: "email",
            },
            input: {
                type: "email",
                name: "email",
                id: "email",
                autocomplete: "username",
                value: this.values ? this.values.email : "",
            },
            error: this.errors && this.errors.email,
            message: this.errors && this.errors.email ? this.errors.email : "",
            callback: (value) => {
                this.values.email = value;
                this.errors = null;
            },
        });
        const emailField = email.getField();
        this.loginForm.appendChild(emailField);

        const password = new Input({
            label: {
                text: "Contraseña",
                for: "password",
            },
            input: {
                type: "password",
                name: "password",
                id: "password",
                autocomplete: "current-password",
                value: this.values ? this.values.password : "",
            },
            error: this.errors && this.errors.password,
            message: this.errors && this.errors.password ? this.errors.password : "",
            callback: (value) => {
                this.values.password = value;
                this.errors = null;
            },
        });
        const passwordField = password.getField();
        this.loginForm.appendChild(passwordField);

        const submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Iniciar sesión";
        submit.classList.add("btn", "primary-btn");
        this.loginForm.appendChild(submit);
    }

    repaintLoginForm() {
        this.loginForm.remove();
        this.createLoginForm();
    }

    async login(e) {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const response = await api.post("/api/user/login", data);

        if (response.status === "error") {
            this.errors = response.errors;
            this.repaintLoginForm();
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Login correcto!",
            message: "Serás redirigido al panel principal",
            timer: 3000,
        });

        window.location.href = "/admin";
    }

    async register() {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const response = await api.post("/api/user/register");
    }

    async confirm() {
        const token = window.location.pathname.split("/").pop();

        const data = new FormData();
        data.append("token", token);

        const response = await api.post("/api/user/confirm");
    }

    async recover() {
        const data = new FormData();
        data.append("token", token);

        const response = await api.post("/api/user/recover");
    }

    async restore() {
        const data = new FormData();
        data.append("token", token);

        const response = await api.post("/api/user/restore");
    }
}

export default User;
