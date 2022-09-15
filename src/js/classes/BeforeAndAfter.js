class BeforeAndAfter {
    constructor(target, before, after) {
        this.target = target;

        this.before = before;
        this.after = after;

        this.isStart = false;
        this.isMove = false;
        this.isOut = false;

        this.initialPosX = 0;
        this.currentPosX = 0;
        this.finalPosX = 0;

        this.moveX = 0;

        this.init();
    }

    async init() {
        document.addEventListener("mouseup", this.end.bind(this));
        document.addEventListener("touchend", this.end.bind(this));

        this.target.appendChild(this.create());
    }

    handleClick(e) {
        const rect = e.currentTarget.getBoundingClientRect();

        this.currentPosX = e.clientX ?? e.touches[0].clientX;

        const left = rect.left;
        const positionX = this.currentPosX - left;
        const width = this.beforeAndAfter.offsetWidth;
        const moveX = width / 2 - positionX;
        const percentageX = (50 * width - 100 * moveX) / width;

        this.before.style.clipPath = `polygon(0 0, ${percentageX}% 0, ${percentageX}% 100%, 0 100%)`;
        this.after.style.clipPath = `polygon(${percentageX}% 0, 100% 0, 100% 100%, ${percentageX}% 100%)`;
        this.handle.style.left = `${percentageX}%`;

        this.finalPosX = moveX;
    }

    start(e) {
        this.isStart = true;

        this.disableTransition();

        this.initialPosX = e.clientX ?? e.touches[0].clientX;

        this.moveListener = this.move.bind(this);
        this.endListener = this.end.bind(this);

        document.addEventListener("mousemove", this.moveListener);
        document.addEventListener("touchmove", this.moveListener);
        document.addEventListener("mouseup", this.endListener);
        document.addEventListener("touchend", this.endListener);
    }

    move(e) {
        if (!this.isStart) {
            return;
        }

        this.isMove = true;

        this.currentPosX = e.clientX ?? e.touches[0].clientX;
        this.moveX = this.finalPosX + this.initialPosX - this.currentPosX;

        const width = this.beforeAndAfter.offsetWidth;
        const percentageX = (50 * width - 100 * this.moveX) / width;

        if (percentageX < 0) {
            this.moveX = width / 2;
            this.before.style.clipPath = `polygon(0 0, 0 0, 0 100%, 0 100%)`;
            this.after.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%)`;
            this.handle.style.left = "0";
            return;
        }

        if (percentageX > 100) {
            this.moveX = -width / 2;
            this.before.style.clipPath = `polygon(0 0, 100% 0, 100% 100%, 0 100%)`;
            this.after.style.clipPath = `polygon(100% 0, 100% 0, 100% 100%, 100% 100%)`;
            this.handle.style.left = "100%";
            return;
        }

        this.before.style.clipPath = `polygon(0 0, ${percentageX}% 0, ${percentageX}% 100%, 0 100%)`;
        this.after.style.clipPath = `polygon(${percentageX}% 0, 100% 0, 100% 100%, ${percentageX}% 100%)`;
        this.handle.style.left = `${percentageX}%`;
    }

    end() {
        if (!this.isStart) {
            return;
        }

        this.finalPosX = this.moveX;
        this.isStart = false;
        this.isMove = false;

        this.enableTransition();

        document.removeEventListener("mousemove", this.moveListener);
        document.removeEventListener("touchmove", this.moveListener);
        document.removeEventListener("mouseup", this.endListener);
        document.removeEventListener("touchend", this.endListener);
    }

    out() {
        if (!this.isStart) {
            return;
        }

        this.isOut = true;
    }

    create() {
        this.beforeAndAfter = document.createElement("div");
        this.beforeAndAfter.classList.add("before-and-after");

        this.before.style.clipPath = "polygon(0 0, 50% 0, 50% 100%, 0 100%)";
        this.before.classList.add("before");
        this.beforeAndAfter.appendChild(this.before);

        this.after.style.clipPath = "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)";
        this.after.classList.add("after");
        this.beforeAndAfter.appendChild(this.after);

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        overlay.addEventListener("click", this.handleClick.bind(this));
        this.beforeAndAfter.appendChild(overlay);

        this.handle = document.createElement("div");
        this.handle.classList.add("handle");
        this.handle.style.left = "50%";
        this.handle.addEventListener("mousedown", this.start.bind(this));
        this.handle.addEventListener("touchstart", this.start.bind(this), { passive: true });
        this.handle.addEventListener("mouseout", this.out.bind(this));
        this.beforeAndAfter.appendChild(this.handle);

        const circle = document.createElement("div");
        circle.classList.add("circle");
        this.handle.appendChild(circle);

        const caretLeftSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        caretLeftSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        caretLeftSvg.setAttribute("width", "16");
        caretLeftSvg.setAttribute("height", "16");
        caretLeftSvg.setAttribute("fill", "currentColor");
        caretLeftSvg.setAttribute("viewBox", "0 0 16 16");
        circle.appendChild(caretLeftSvg);

        const caretLeftPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        caretLeftPath.setAttribute(
            "d",
            "m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"
        );
        caretLeftSvg.appendChild(caretLeftPath);

        const caretRightSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        caretRightSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        caretRightSvg.setAttribute("width", "16");
        caretRightSvg.setAttribute("height", "16");
        caretRightSvg.setAttribute("fill", "currentColor");
        caretRightSvg.setAttribute("viewBox", "0 0 16 16");
        circle.appendChild(caretRightSvg);

        const caretRightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        caretRightPath.setAttribute(
            "d",
            "m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
        );
        caretRightSvg.appendChild(caretRightPath);

        return this.beforeAndAfter;
    }

    enableTransition() {
        this.before.classList.remove("notransition");
        this.after.classList.remove("notransition");
        this.handle.classList.remove("notransition");
    }

    disableTransition() {
        this.before.classList.add("notransition");
        this.after.classList.add("notransition");
        this.handle.classList.add("notransition");
    }

    destroy() {
        this.beforeAndAfter.remove();
        delete this;
    }
}

export default BeforeAndAfter;
