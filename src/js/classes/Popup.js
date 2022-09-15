class Popup {
    constructor() {
        this.popup;

        this.type;
        this.title;
        this.message;
        this.timer;
    }

    setOptions(options) {
        this.type = options.type;
        this.title = options.title;
        this.message = options.message;
        this.timer = options.timer;
    }

    async open(options) {
        this.setOptions(options);

        this.popup = this.createPopup();
        document.body.appendChild(this.popup);

        const animations = this.popup.getAnimations();
        await Promise.all(animations.map((animation) => animation.finished));

        if (this.timer) {
            await new Promise((resolve) => setTimeout(resolve, this.timer));
            await this.close(this.popup);
        }
    }

    async close() {
        this.popup.classList.add("fadeOut");
        this.popup.firstChild.classList.add("slideOutTop");

        const animations = this.popup.getAnimations();

        return Promise.all(animations.map((animation) => animation.finished)).then(() =>
            this.popup.remove()
        );
    }

    createPopup() {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.addEventListener("click", this.close.bind(this));

        const content = document.createElement("div");
        content.classList.add("content");
        content.addEventListener("click", (e) => e.stopPropagation());
        popup.appendChild(content);

        const header = document.createElement("div");
        header.classList.add("header");
        content.appendChild(header);

        const icon = this.createIcon(this.type);
        header.appendChild(icon);

        const main = document.createElement("div");
        main.classList.add("main");
        content.appendChild(main);

        if (this.title) {
            const text = document.createElement("div");
            text.classList.add("title");
            text.textContent = this.title;
            main.appendChild(text);
        }

        if (this.message) {
            const text = document.createElement("div");
            text.classList.add("message");
            text.textContent = this.message;
            main.appendChild(text);
        }

        return popup;
    }

    createIcon(type) {
        if (type === "success") {
            const animatedIcon = document.createElement("div");
            animatedIcon.classList.add("animated-icon");

            const success = document.createElement("div");
            success.classList.add("success");
            animatedIcon.appendChild(success);

            const lineTip = document.createElement("div");
            lineTip.classList.add("line", "tip");
            success.appendChild(lineTip);

            const lineLong = document.createElement("div");
            lineLong.classList.add("line", "long");
            success.appendChild(lineLong);

            const circle = document.createElement("div");
            circle.classList.add("circle");
            success.appendChild(circle);

            const fix = document.createElement("div");
            fix.classList.add("fix");
            success.appendChild(fix);

            return animatedIcon;
        }

        if (type === "error") {
            const animatedIcon = document.createElement("div");
            animatedIcon.classList.add("animated-icon");

            const error = document.createElement("div");
            error.classList.add("error");
            animatedIcon.appendChild(error);

            const x = document.createElement("div");
            x.classList.add("x");
            error.appendChild(x);

            const left = document.createElement("div");
            left.classList.add("left");
            x.appendChild(left);

            const right = document.createElement("div");
            right.classList.add("right");
            x.appendChild(right);

            const placeholder = document.createElement("div");
            placeholder.classList.add("placeholder");
            error.appendChild(placeholder);

            const fix = document.createElement("div");
            fix.classList.add("fix");
            error.appendChild(fix);

            return animatedIcon;
        }
    }
}

export default Popup;
