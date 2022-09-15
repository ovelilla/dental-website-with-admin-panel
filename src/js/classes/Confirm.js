import { icon } from "../modules/Icon.js";

class Confirm {
    constructor({ title, description, accept, cancel }) {
        this.title = title;
        this.description = description;
        this.accept = accept;
        this.cancel = cancel;

        this.init();
    }

    init() {
        this.show();
    }

    question() {
        return new Promise((resolve, reject) => {
            if (!this.dialog || !this.acceptButton || !this.cancelButton || !this.closeButton) {
                reject("There was a problem creating the modal window!");
                return;
            }

            this.dialog.addEventListener("click", () => {
                resolve(null);
                this.close();
            });

            this.acceptButton.addEventListener("click", () => {
                resolve(true);
                this.close();
            });

            this.cancelButton.addEventListener("click", () => {
                resolve(false);
                this.close();
            });

            this.closeButton.addEventListener("click", () => {
                resolve(null);
                this.close();
            });
        });
    }

    show() {
        const confirm = this.create();
        document.body.appendChild(confirm);
    }

    create() {
        this.dialog = document.createElement("div");
        this.dialog.classList.add("confirm");

        const content = document.createElement("div");
        content.classList.add("content");
        content.addEventListener("click", (e) => e.stopPropagation());
        this.dialog.appendChild(content);

        const header = document.createElement("div");
        header.classList.add("header");
        content.appendChild(header);

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = this.title;
        header.appendChild(title);

        this.closeButton = document.createElement("button");
        this.closeButton.type = "button";
        this.closeButton.classList.add("close");
        header.appendChild(this.closeButton);

        const closeIcon = icon.get("xLg");
        this.closeButton.appendChild(closeIcon);

        const body = document.createElement("div");
        body.classList.add("body");
        content.appendChild(body);

        const description = document.createElement("div");
        description.classList.add("description");
        description.textContent = this.description;
        body.appendChild(description);

        const footer = document.createElement("div");
        footer.classList.add("footer");
        content.appendChild(footer);

        this.cancelButton = document.createElement("button");
        this.cancelButton.type = "button";
        this.cancelButton.classList.add("cancel");
        this.cancelButton.textContent = this.cancel;
        footer.appendChild(this.cancelButton);

        this.acceptButton = document.createElement("button");
        this.acceptButton.type = "button";
        this.acceptButton.classList.add("accept");
        this.acceptButton.textContent = this.accept;
        footer.appendChild(this.acceptButton);

        return this.dialog;
    }

    "rehabilitacion-oral-protesis-dentales";
    "rehabilitacion-oral-protesis-dentales";

    async close() {
        this.dialog.classList.add("fadeOut");
        this.dialog.firstChild.classList.add("slideOutTop");

        await this.animationend(this.dialog);

        this.dialog.remove();
        delete this;
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
}

export default Confirm;
