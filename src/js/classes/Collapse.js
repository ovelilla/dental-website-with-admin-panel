class Collapse {
    constructor(target, container, collapsed) {
        this.target = target;
        this.container = container;

        this.collapsed = collapsed;
        this.type = collapsed;

        this.start = false;

        if (this.target) {
            this.target.addEventListener('click', this.toggle.bind(this));
        }
    }

    async toggle() {
        this.setStart(true);
        this.toggleClass();

        if (this.collapsed) {
            this.setCollapsed(false);
            await this.expandEl();
        } else {
            this.setCollapsed(true);
            await this.collapseEl();
        }

        this.heightAuto();
        this.clean();
        this.setStart(false);
    }

    async expand() {
        this.setStart(true);
        this.addClass();
        this.setCollapsed(false);
        await this.expandEl();
        this.heightAuto();
        this.clean();
        this.setStart(false);
    }

    async collapse() {
        this.setStart(true);
        this.addClass();
        this.setCollapsed(true);
        await this.collapseEl();
        this.heightAuto();
        this.clean();
        this.setStart(false);
    }

    async expandEl() {
        return new Promise(resolve => {
            this.container.style.height = this.container.scrollHeight + "px";
            this.container.addEventListener('transitionend', resolve, { once: true });
        });
    }

    async collapseEl() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                this.container.style.height = this.container.scrollHeight + 'px';
                requestAnimationFrame(() => {
                    this.container.style.height = 0 + 'px';
                });
            });
            this.container.addEventListener('transitionend', resolve, { once: true });
        });
    }

    heightAuto() {
        if (this.type && !this.collapsed) {
            this.container.style.height = 'auto';
        }
    }

    setStart(start) {
        this.start = start;
    }

    setCollapsed(collapsed) {
        this.collapsed = collapsed;
    }

    addClass() {
        this.target.classList.add('active');
    }

    removeClass() {
        this.target.classList.remove('active');
    }

    toggleClass() {
        this.target.classList.toggle('active');
    }

    clean() {
        if ((!this.type && !this.collapsed) || (this.type && this.collapsed)) {
            this.container.removeAttribute("style");
            if (this.target.className == "") {
                this.target.removeAttribute("class");
            }
        }
    }
}

export default Collapse;
