import { icon } from "../modules/Icon.js";

class Signature {
    constructor(data) {
        Object.assign(this, data);

        this.drawing = false;
        this.cp = null;

        this.base64 = "";
        this.blob = null;

        this.init();
    }

    init() {
        window.addEventListener("resize", this.resize.bind(this));
        
        const wrapper = document.createElement("div");
        wrapper.classList.add("signature");
        this.container.appendChild(wrapper);

        if (this.title) {
            const title = document.createElement("p");
            title.classList.add("title");
            title.textContent = this.title;
            wrapper.appendChild(title);
        }

        this.canvas = document.createElement("canvas");
        this.canvas.addEventListener("mousedown", this.start.bind(this));
        this.canvas.addEventListener("touchstart", this.start.bind(this), { passive: true });
        this.canvas.addEventListener("mousemove", this.move.bind(this));
        this.canvas.addEventListener("touchmove", this.move.bind(this), { passive: false });
        this.canvas.addEventListener("mouseup", this.end.bind(this));
        this.canvas.addEventListener("touchend", this.end.bind(this));
        document.body.addEventListener("mouseup", this.end.bind(this));
        document.body.addEventListener("touchend", this.end.bind(this));

        wrapper.appendChild(this.canvas);

        new MutationObserver(async () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;

            if (this.signature) {
                const image = await this.createImage(this.signature);
                this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
            }
        }).observe(wrapper, { childList: true });

        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.clear) {
            const clearButton = document.createElement("button");
            clearButton.classList.add("clear");
            clearButton.type = "button";
            clearButton.addEventListener("click", () => {
                this.ctx.fillStyle = "#ffffff";
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            });

            wrapper.appendChild(clearButton);

            const clearIcon = icon.get("eraserFill");
            clearButton.appendChild(clearIcon);
        }
    }

    start(e) {
        this.drawing = true;

        const { x, y } = this.getCursorPosition(e);

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#32539a";
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";

        this.cp = { x, y };

        this.draw(x, y);
    }

    move(e) {
        e.preventDefault();
        if (!this.drawing) {
            return;
        }
        const { x, y } = this.getCursorPosition(e);

        this.draw(x, y);
    }

    end() {
        this.drawing = false;
    }

    getCursorPosition(e) {
        const rect = this.canvas.getBoundingClientRect();

        const x = (e.clientX ?? e.touches[0].clientX) - rect.left;
        const y = (e.clientY ?? e.touches[0].clientY) - rect.top;

        return { x, y };
    }

    draw(cursorX, cursorY) {
        const cpx = this.cp.x;
        const cpy = this.cp.y;

        const x = (this.cp.x + cursorX) / 2;
        const y = (this.cp.y + cursorY) / 2;

        this.ctx.quadraticCurveTo(cpx, cpy, x, y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        this.cp = { x, y };
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    base64toBlob(base64, mime = "", sliceSize = 512) {
        const byteChars = atob(base64);
        const byteArrays = [];

        for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            const slice = byteChars.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mime });
    }

    blobToImage(blob) {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        return img;
    }

    getBase64() {
        return this.canvas.toDataURL("image/png");
    }

    getBlob() {
        this.canvas.toDataURL("image/png");
        return this.base64toBlob(this.base64.split(",")[1], "image/png");
    }

    createImage(src, alt = "") {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.alt = alt;
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", () => reject(new Error("Error loading image")));
        });
    }
}

export default Signature;
