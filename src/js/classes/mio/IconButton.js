class IconButton {
    constructor({ type, ariaLabel, buttonSize, svgSize, icon, callback }) {
        this.type = type;
        this.ariaLabel = ariaLabel;
        this.buttonSize = buttonSize;
        this.svgSize = svgSize;
        this.icon = icon;
        this.callback = callback;

        this.init();
    }

    init() {
        this.iconButton = this.create();
    }

    get() {
        return this.iconButton;
    }

    create() {
        const iconButton = document.createElement("button");

        iconButton.type = this.type ?? "button";
        iconButton.ariaLabel = this.ariaLabel ?? "";

        iconButton.classList.add("mio-icon-btn");

        switch (this.buttonSize) {
            case "small":
                iconButton.classList.add("btn-size-small");
                break;
            case "medium":
                iconButton.classList.add("btn-size-medium");
                break;
            case "large":
                iconButton.classList.add("btn-size-large");
                break;
            case "xl":
                iconButton.classList.add("btn-size-xl");
                break;
            default:
                iconButton.classList.add("btn-medium-small");
                break;
        }

        switch (this.svgSize) {
            case "xs":
                iconButton.classList.add("svg-size-xs");
                break;
            case "small":
                iconButton.classList.add("svg-size-small");
                break;
            case "medium":
                iconButton.classList.add("svg-size-medium");
                break;
            case "large":
                iconButton.classList.add("svg-size-large");
                break;
            case "xl":
                iconButton.classList.add("svg-size-xl");
                break;
            default:
                iconButton.classList.add("svg-size-medium");
                break;
        }

        iconButton.addEventListener("click", this.callback);

        iconButton.appendChild(this.icon);

        return iconButton;
    }
}

export default IconButton;
