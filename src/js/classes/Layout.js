import { api, popup } from "../app.js";
import Collapse from "./Collapse.js";
import Input from "./mio/Input.js";
import Textarea from "./mio/Textarea.js";
import Checkbox from "./mio/Checkbox.js";
import { icon } from "../modules/Icon.js";

class Layout {
    constructor() {
        this.pageYOffset = 0;

        this.isSidebarOpened = false;
        this.isSidebarAnimated = false;

        this.values = {
            name: "",
            email: "",
            phone: "",
            message: "",
            accept: false,
        };
        this.errors = null;

        this.init();
    }

    init() {
        const hamburguer = document.querySelector("#hamburguer");
        const navbar = document.querySelector("#navbar");
        const sidebar = document.querySelector("#sidebar");
        const accordion = document.querySelector("#accordion");
        const contact = document.querySelector("#contact");

        window.addEventListener("DOMContentLoaded", this.loadEvent.bind(this));
        window.addEventListener("scroll", this.scrollEvent.bind(this));
        window.addEventListener("resize", this.resizeEvent.bind(this));

        hamburguer.addEventListener("click", this.hamburguerEvent.bind(this));
        navbar.addEventListener("click", this.navbarEvent.bind(this));
        sidebar.addEventListener("click", this.sidebarEvent.bind(this));
        if (accordion) {
            accordion.addEventListener("click", this.accordionEvent.bind(this));
        }
        if (contact) {
            this.createContactForm();
        }

        sidebar.querySelectorAll("button").forEach((button) => {
            new Collapse(button, button.nextElementSibling, true);
        });

        this.createWhatsappButton();

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", this.themeChange.bind(this));
    }

    themeChange() {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const faviconEl = document.querySelector('link[rel="shortcut icon"]');
        const pngIcons = document.querySelectorAll('link[rel="icon"]');
        const appleIcons = document.querySelectorAll('link[rel="apple-touch-icon"]');

        if (mediaQuery.matches) {
            faviconEl.setAttribute("href", "/build/img/iconos/icono16-light.ico");
            pngIcons.forEach((icon) => {
                icon.setAttribute("href", icon.getAttribute("href").replace("dark", "light"));
            });
            appleIcons.forEach((icon) => {
                icon.setAttribute("href", icon.getAttribute("href").replace("dark", "light"));
            });
        } else {
            faviconEl.setAttribute("href", "/build/img/iconos/icono16-dark.ico");
            pngIcons.forEach((icon) => {
                icon.setAttribute("href", icon.getAttribute("href").replace("light", "dark"));
            });
            appleIcons.forEach((icon) => {
                icon.setAttribute("href", icon.getAttribute("href").replace("light", "dark"));
            });
        }
    }

    loadEvent() {
        const mainHeader = document.querySelector("#main-header");
        if (window.pageYOffset > 0) {
            mainHeader.classList.add("active");
        }

        const accordion = document.querySelector("#accordion");

        if (accordion) {
            const accordionItems = accordion.querySelectorAll(".item");

            accordionItems.forEach((item) => {
                const target = item.firstElementChild;
                const content = item.lastElementChild;
                new Collapse(target, content, true);
            });
        }

        this.themeChange();
    }

    scrollEvent() {
        const mainHeader = document.querySelector("#main-header");

        if (this.isSidebarOpened) {
            return;
        }

        if (window.pageYOffset > 0) {
            mainHeader.classList.add("active");
        } else {
            mainHeader.classList.remove("active");
        }
    }

    async resizeEvent() {
        const hamburguer = document.querySelector("#hamburguer");
        const mainHeader = document.querySelector("#main-header");
        const sidebar = document.querySelector("#sidebar");

        if (window.innerWidth >= 1024 && this.isSidebarOpened) {
            this.isSidebarOpened = false;
            this.isSidebarAnimated = true;

            document.body.removeAttribute("style");
            document.body.classList.remove("noscroll");
            window.scroll(0, this.pageYOffset);

            hamburguer.classList.remove("active");
            mainHeader.classList.remove("active");
            sidebar.classList.add("out");
            await this.animationend(sidebar);
            sidebar.classList.remove("active", "in", "out");

            this.isSidebarAnimated = false;
            return;
        }
    }

    async hamburguerEvent() {
        const hamburguer = document.querySelector("#hamburguer");
        const mainHeader = document.querySelector("#main-header");
        const sidebar = document.querySelector("#sidebar");

        if (this.isSidebarOpened && !this.isSidebarAnimated) {
            this.isSidebarOpened = false;
            this.isSidebarAnimated = true;

            document.body.removeAttribute("style");
            document.body.classList.remove("noscroll");
            window.scroll(0, this.pageYOffset);

            if (!window.pageYOffset) {
                mainHeader.classList.remove("active");
            }

            hamburguer.classList.remove("active");
            sidebar.classList.add("out");
            await this.animationend(sidebar);
            sidebar.classList.remove("active", "in", "out");

            this.isSidebarAnimated = false;
            this.pageYOffset = 0;
            return;
        }

        if (!this.isSidebarOpened && !this.isSidebarAnimated) {
            this.pageYOffset = window.pageYOffset;

            this.isSidebarOpened = true;
            this.isSidebarAnimated = true;

            document.body.style.top = `-${this.pageYOffset}px`;
            document.body.classList.add("noscroll");

            hamburguer.classList.add("active");
            mainHeader.classList.add("active");
            sidebar.classList.add("active", "in");
            await this.animationend(sidebar);

            this.isSidebarAnimated = false;
            return;
        }
    }

    async navbarEvent(e) {
        if (e.target.closest("button")) {
            const menuBtn = e.target.closest("button");
            const menu = menuBtn.nextElementSibling;

            requestAnimationFrame(() => {
                menu.classList.remove("hidden");
                menu.classList.add("flex");
                requestAnimationFrame(() => {
                    menu.classList.remove("out");
                });
            });
            menu.classList.add("in");
            await this.transitionend(menu);
            menuBtn.ariaExpanded = true;
        }

        if (e.target.closest(".menu")) {
            const menu = e.target.closest(".menu");
            const menuBtn = menu.previousElementSibling;
            menu.classList.remove("in");
            menu.classList.add("out");
            await this.transitionend(menu);
            menu.classList.remove("flex");
            menu.classList.add("hidden");
            menuBtn.ariaExpanded = false;
        }
    }

    async sidebarEvent(e) {
        const hamburguer = document.querySelector("#hamburguer");
        const mainHeader = document.querySelector("#main-header");
        const sidebar = document.querySelector("#sidebar");

        if (e.target.id === "sidebar" && this.isSidebarOpened && !this.isSidebarAnimated) {
            this.isSidebarOpened = false;
            this.isSidebarAnimated = true;

            document.body.removeAttribute("style");
            document.body.classList.remove("noscroll");
            window.scroll(0, this.pageYOffset);

            if (!window.pageYOffset) {
                mainHeader.classList.remove("active");
            }

            hamburguer.classList.remove("active");
            sidebar.classList.add("out");
            await this.animationend(sidebar);
            sidebar.classList.remove("active", "in", "out");

            this.isSidebarAnimated = false;
        }
    }

    async accordionEvent(e) {
        const targetItem = e.target.closest(".item");
        if (targetItem && targetItem.firstElementChild.classList.contains("active")) {
            const accordion = document.querySelector("#accordion");
            const accordionItems = accordion.querySelectorAll(".item");
            const targetItem = e.target.closest(".item");

            accordionItems.forEach((item) => {
                if (item !== targetItem && item.firstElementChild.classList.contains("active")) {
                    item.firstElementChild.click();
                }
            });
        }
    }

    async transitionend(target) {
        return new Promise((resolve) => {
            target.addEventListener("transitionend", resolve, { once: true });
        });
    }

    async animationend(target) {
        return new Promise((resolve) => {
            target.addEventListener("animationend", resolve, { once: true });
        });
    }

    createContactForm() {
        const contact = document.querySelector("#contact");

        this.contactForm = document.createElement("form");
        this.contactForm.classList.add("mio-form");
        this.contactForm.noValidate = true;
        this.contactForm.addEventListener("submit", this.handleSubmit.bind(this));
        contact.appendChild(this.contactForm);

        const name = new Input({
            label: {
                text: "Nombre",
                for: "name",
            },
            input: {
                type: "text",
                name: "name",
                id: "name",
                value: this.values.name,
            },
            error: this.errors && this.errors.name,
            message: this.errors && this.errors.name ? this.errors.name : "",
            callback: (value) => {
                this.values.name = value;
                this.errors = null;
            },
        });
        this.contactForm.appendChild(name.getField());

        const email = new Input({
            label: {
                text: "Email",
                for: "email",
            },
            input: {
                type: "text",
                name: "email",
                id: "email",
                value: this.values.email,
            },
            error: this.errors && this.errors.email,
            message: this.errors && this.errors.email ? this.errors.email : "",
            callback: (value) => {
                this.values.email = value;
                this.errors = null;
            },
        });
        this.contactForm.appendChild(email.getField());

        const phone = new Input({
            label: {
                text: "Teléfono",
                for: "phone",
            },
            input: {
                type: "tel",
                phone: "phone",
                id: "phone",
                value: this.values.phone,
            },
            error: this.errors && this.errors.phone,
            message: this.errors && this.errors.phone ? this.errors.phone : "",
            callback: (value) => {
                this.values.phone = value;
                this.errors = null;
            },
        });
        this.contactForm.appendChild(phone.getField());

        const message = new Textarea({
            label: {
                text: "Mensaje",
                for: "message",
            },
            input: {
                name: "message",
                id: "message",
                rows: 3,
                value: this.values.message,
            },
            error: this.errors && this.errors.message,
            message: this.errors && this.errors.message ? this.errors.message : "",
            callback: (value) => {
                this.values.message = value;
                this.errors = null;
            },
        });
        this.contactForm.appendChild(message.getField());

        const accept = new Checkbox({
            label: {
                text: "He leído y acepto la Política de Privacidad",
                for: "accept",
            },
            input: {
                name: "accept",
                id: "accept",
                value: this.values.accept,
            },
            error: this.errors && this.errors.accept,
            message: this.errors && this.errors.accept ? this.errors.accept : "",
            callback: (value) => {
                this.values.accept = value;
                this.errors = null;
            },
        });
        this.contactForm.appendChild(accept.getField());

        const submitField = document.createElement("div");
        submitField.classList.add("mio-field");
        this.contactForm.appendChild(submitField);

        const submit = document.createElement("button");
        submit.classList.add("btn", "primary-btn");
        submit.type = "submit";
        submit.textContent = "Enviar";
        submitField.appendChild(submit);
    }

    async handleSubmit(e) {
        e.preventDefault();

        const response = await api.post("/api/contact", this.values);

        if (response.status === "error") {
            this.errors = response.errors;
            this.contactForm.remove();
            this.createContactForm();
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Mensaje enviado!",
            message:
                "Gracias por contactar con nosotros. Nos pondremos en contacto contigo lo antes posible.",
            timer: 3000,
        });

        this.values = {
            name: "",
            email: "",
            phone: "",
            message: "",
            accept: false,
        };
        this.errors = null;
        this.contactForm.remove();
        this.createContactForm();
    }

    createWhatsappButton() {
        const whatsapp = document.createElement("a");
        whatsapp.classList.add("quick-access-btn", "whatsapp");
        whatsapp.href = "https://wa.me/34622348982";
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
        whatsapp.ariaLabel = "Abrir WhatsApp";
        document.body.appendChild(whatsapp);

        whatsapp.appendChild(icon.get("whatsapp"));

        const mail = document.createElement("a");
        mail.classList.add("quick-access-btn", "mail");
        mail.href = "/contacto";
        mail.ariaLabel = "Abrir formulario de contacto";
        document.body.appendChild(mail);

        mail.appendChild(icon.get("envelope"));
    }
}

export default Layout;
