import { icon } from "../modules/Icon.js";
import LoadingButton from "./LoadingButton.js";
import Confirm from "./Confirm.js";

class Modal {
    constructor({
        title,
        customTitle,
        content,
        action,
        maxWidth,
        fullscreenButton,
        actionCallback,
        closeCallback,
        fullscreenCallback,
        customHeaderButtons,
    }) {
        this.title = title;
        this.customTitle = customTitle;
        this.content = content;
        this.action = action;
        this.maxWidth = maxWidth || null;
        this.fullscreenButton = fullscreenButton || false;
        this.actionCallback = actionCallback;
        this.closeCallback = closeCallback;
        this.fullscreenCallback = fullscreenCallback;
        this.customHeaderButtons = customHeaderButtons || [];

        this.isClose = false;
        this.isFullscreen = false;
        this.isMove = false;

        this.init();
    }

    async init() {
        this.modal = this.create();
        document.body.classList.add("noscroll");
        document.body.appendChild(this.modal);
        this.modal.classList.add("fade-in");
        this.modal.firstChild.classList.add("slide-in-top");

        await this.animationend();
    }

    handleClose(e) {
        if (e.target === this.modal) {
            this.isClose = true;
        }
    }

    async close() {
        this.actionButton.stop();
        this.modal.classList.add("fade-out");
        this.modal.firstChild.classList.add("slide-out-top");
        await this.animationend(this.modal);
        this.modal.remove();
        if (!document.querySelector(".modal")) {
            document.body.classList.remove("noscroll");
        }
        this.closeCallback && this.closeCallback();
        delete this;
    }

    async animationend() {
        return new Promise((resolve) => {
            this.modal.addEventListener("animationend", resolve, { once: true });
        });
    }

    create() {
        const modal = document.createElement("div");
        modal.classList.add("modal");
        if (this.isFullscreen) {
            modal.classList.add("fullscreen");
        }
        modal.addEventListener("mousedown", this.handleClose.bind(this));
        modal.addEventListener("touchstart", this.handleClose.bind(this), { passive: true });
        modal.addEventListener("click", async () => {
            if (this.isClose) {
                const confirm = new Confirm({
                    title: "¿Cerrar ventana?",
                    description:
                        "¿Estás seguro de que deseas cerrar? Los datos que no hayan sido guardados se perderán.",
                    accept: "Cerrar",
                    cancel: "Cancelar",
                });
                const confirmResponse = await confirm.question();

                if (!confirmResponse) {
                    return;
                }

                this.close();
            }
        });

        const content = document.createElement("div");
        content.classList.add("content");
        if (!this.isFullscreen) {
            content.style.maxWidth = this.maxWidth ? this.maxWidth : "";
        }
        if (this.left && this.top) {
            content.style.position = "absolute";
            content.style.left = this.left + "px";
            content.style.top = this.top + "px";
        }
        content.addEventListener("click", (e) => e.stopPropagation());
        modal.appendChild(content);

        const header = document.createElement("div");
        header.classList.add("header");
        this.start = this.handleStart.bind(this);
        header.addEventListener("mousedown", this.start);
        header.addEventListener("touchstart", this.start, { passive: true });
        content.appendChild(header);

        if (this.customTitle) {
            header.appendChild(this.customTitle());
        } else {
            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = this.title;
            header.appendChild(title);
        }

        const actions = document.createElement("div");
        actions.classList.add("actions");
        header.appendChild(actions);

        this.customHeaderButtons.forEach((button) => {
            const btn = document.createElement("button");
            btn.setAttribute("aria-label", button.ariaLabel);
            btn.addEventListener("click", () => {
                button.callback();
            });
            actions.appendChild(btn);

            btn.appendChild(button.icon);
        });

        if (this.fullscreenButton) {
            const fullscreenBtn = document.createElement("button");
            fullscreenBtn.classList.add("fullscreen");
            fullscreenBtn.setAttribute("aria-label", "Pantalla completa");
            fullscreenBtn.addEventListener("click", () => {
                this.isFullscreen = !this.isFullscreen;

                if (this.isFullscreen) {
                    modal.classList.add("fullscreen");
                    content.removeAttribute("style");
                } else {
                    modal.classList.remove("fullscreen");
                    content.style.maxWidth = this.maxWidth ? this.maxWidth : "";
                }

                this.fullscreenCallback && this.fullscreenCallback();
            });
            fullscreenBtn.addEventListener("mousedown", (e) => e.stopPropagation());
            actions.appendChild(fullscreenBtn);

            const fullscreenIcon = icon.get("arrowsFullscreen");
            fullscreenBtn.appendChild(fullscreenIcon);
        }

        const closeBtn = document.createElement("button");
        closeBtn.classList.add("close");
        closeBtn.setAttribute("aria-label", "Cerrar modal");
        closeBtn.addEventListener("click", async () => {
            const confirm = new Confirm({
                title: "¿Cerrar ventana?",
                description: "¿Estás seguro de que deseas cerrar? Los datos que no hayan sido guardados se perderán.",
                accept: "Cerrar",
                cancel: "Cancelar",
            });
            const confirmResponse = await confirm.question();

            if (!confirmResponse) {
                return;
            }

            this.isClose = true;
            this.close();
        });
        closeBtn.addEventListener("mousedown", (e) => e.stopPropagation());
        actions.appendChild(closeBtn);

        const closeIcon = icon.get("xLg");
        closeBtn.appendChild(closeIcon);

        const svgClose = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgClose.setAttribute("width", "16");
        svgClose.setAttribute("height", "16");
        svgClose.setAttribute("fill", "currentColor");
        svgClose.setAttribute("viewBox", "0 0 16 16");
        closeIcon.appendChild(svgClose);

        const pathClose1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathClose1.setAttribute("fill-rule", "evenodd");
        pathClose1.setAttribute(
            "d",
            "M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
        );
        svgClose.appendChild(pathClose1);

        const pathClose2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathClose2.setAttribute("fill-rule", "evenodd");
        pathClose2.setAttribute(
            "d",
            "M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
        );
        svgClose.appendChild(pathClose2);

        this.body = document.createElement("div");
        this.body.classList.add("body");
        this.body.appendChild(this.content);
        content.appendChild(this.body);

        const footer = document.createElement("div");
        footer.classList.add("footer");
        content.appendChild(footer);

        const closeButton = document.createElement("button");
        closeButton.classList.add("btn", "tertiary-btn");
        closeButton.setAttribute("aria-label", "Cerrar modal");
        closeButton.textContent = "Cerrar";
        closeButton.addEventListener("click", async () => {
            const confirm = new Confirm({
                title: "¿Cerrar ventana?",
                description: "¿Estás seguro de que deseas cerrar? Los datos que no hayan sido guardados se perderán.",
                accept: "Cerrar",
                cancel: "Cancelar",
            });
            const confirmResponse = await confirm.question();

            if (!confirmResponse) {
                return;
            }

            this.isClose = true;
            this.close();
        });
        footer.appendChild(closeButton);

        this.actionButton = new LoadingButton({
            type: "button",
            text: this.action,
            ariaLabel: "Acción modal",
            classes: ["btn", "primary-btn"],
            onClick: this.actionCallback,
        });
        footer.appendChild(this.actionButton.get());

        return modal;
    }

    handleStart(e) {
        this.isMove = true;

        this.move = this.handleMove.bind(this);
        this.end = this.handleEnd.bind(this);

        document.addEventListener("mousemove", this.move);
        document.addEventListener("touchmove", this.move, { passive: true });
        document.addEventListener("mouseup", this.end);
        document.addEventListener("touchend", this.end, { passive: true });

        const x = e.clientX ?? e.touches[0].clientX;
        const y = e.clientY ?? e.touches[0].clientY;

        this.startX = x;
        this.startY = y;
    }

    handleMove(e) {
        if (!this.isMove) {
            return;
        }

        const x = e.clientX ?? e.touches[0].clientX;
        const y = e.clientY ?? e.touches[0].clientY;

        const moveX = x - this.startX;
        const moveY = y - this.startY;

        this.startX = x;
        this.startY = y;

        const rect = this.modal.firstChild.getBoundingClientRect();

        this.left = rect.left + moveX;
        this.top = rect.top + moveY;

        this.modal.firstChild.style.position = "absolute";
        this.modal.firstChild.style.left = this.left + "px";
        this.modal.firstChild.style.top = this.top + "px";
    }

    handleEnd() {
        if (!this.isMove) {
            return;
        }
        this.isMove = false;

        document.removeEventListener("mousemove", this.move);
        document.removeEventListener("touchmove", this.move);
        document.removeEventListener("mouseup", this.end);
        document.removeEventListener("touchend", this.end);
    }

    repaint(content) {
        this.content = content;
        this.modal.remove();
        this.modal = this.create();
        document.body.appendChild(this.modal);
    }
}

export default Modal;
