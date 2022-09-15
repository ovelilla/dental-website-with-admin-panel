class Autocomplete {
    constructor(options) {
        this.target = options.target;
        this.data = options.data;
        this.findFields = options.findFields;
        this.showFields = options.showFields;
        this.size = options.size;
        this.callback = options.callback;

        this.filteredData = [];

        this.autocomplete = null;

        this.search = "";

        this.isSelect = false;
        this.isClose = false;

        this.init();
    }

    init() {
        window.addEventListener("resize", this.position.bind(this));
        this.target.addEventListener("keyup", this.handleKeyup.bind(this));
    }

    getShowFields() {
        return this.showFields.reduce((previousValue, currentValue, currentIndex) => {
            return !currentIndex ? row[currentValue] : previousValue + " " + row[currentValue];
        }, "");
    }

    handleKeyup(e) {
        this.search = e.target.value;

        if (this.autocomplete) {
            this.autocomplete.remove();
        }

        this.filterData();

        if (this.filteredData.length === 0) {
            return;
        }

        this.show();
        this.position();
    }

    filterData() {
        let count = 0;

        this.filteredData = this.data.filter((row) => {
            if (count > 20) {
                return false;
            }

            const value = this.findFields.reduce((previousValue, currentValue, currentIndex) => {
                return !currentIndex ? row[currentValue] : previousValue + " " + row[currentValue];
            }, "");

            if (value.toLowerCase().includes(this.search.toLowerCase())) {
                count++;
                return true;
            } else {
                return false;
            }
        });
    }

    show() {
        this.autocomplete = this.create();
        document.body.appendChild(this.autocomplete);
    }

    create() {
        const autocomplete = document.createElement("div");
        autocomplete.classList.add("autocomplete");
        autocomplete.addEventListener("mousedown", this.handleClose.bind(this));
        autocomplete.addEventListener("touchstart", this.handleClose.bind(this), { passive: true });
        autocomplete.addEventListener("click", () => {
            if (this.isClose) {
                this.close();
            }
        });

        const content = document.createElement("div");
        content.classList.add("content");
        content.addEventListener("click", (e) => e.stopPropagation());
        autocomplete.appendChild(content);

        this.filteredData.forEach((row, index) => {
            const item = document.createElement("div");
            item.addEventListener("click", this.handleSelect.bind(this, row));
            item.classList.add("item");

            const searchIconContainer = document.createElement("div");
            searchIconContainer.classList.add("search-icon");
            item.appendChild(searchIconContainer);

            const searchIcon = this.createSearchIcon();
            searchIconContainer.appendChild(searchIcon);

            const text = document.createElement("span");
            const string = this.showFields.reduce((previousValue, currentValue, currentIndex) => {
                return !currentIndex ? row[currentValue] : previousValue + " " + row[currentValue];
            }, "");
            text.innerHTML = this.boldString(string, this.search);
            item.appendChild(text);

            const arrowIconContainer = document.createElement("div");
            arrowIconContainer.classList.add("arrow-icon");
            item.appendChild(arrowIconContainer);

            const arrowIcon = this.createArrowIcon();
            arrowIconContainer.appendChild(arrowIcon);

            content.appendChild(item);
        });

        return autocomplete;
    }

    handleSelect(row) {
        this.isSelect = true;
        const value = this.showFields.reduce((previousValue, currentValue, currentIndex) => {
            return !currentIndex ? row[currentValue] : previousValue + " " + row[currentValue];
        }, "");
        this.target.value = value;
        this.callback(row);
        this.close();
    }

    handleClose(e) {
        if (e.target === this.autocomplete) {
            this.isClose = true;
        }
    }

    position() {
        if (!this.autocomplete) {
            return;
        }

        const rect = this.target.getBoundingClientRect();

        this.autocomplete.firstChild.style.maxWidth = `${this.target.offsetWidth}px`;
        if (window.innerWidth < 768) {
            this.autocomplete.firstChild.style.maxHeight = 44 * this.size + 10 * 2 + "px";
        } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
            this.autocomplete.firstChild.style.maxHeight = 46 * this.size + 10 * 2 + "px";
        } else {
            this.autocomplete.firstChild.style.maxHeight = 48 * this.size + 10 * 2 + "px";
        }

        if (
            rect.top + this.autocomplete.firstChild.offsetHeight + this.target.offsetHeight + 2 >
            window.innerHeight
        ) {
            this.autocomplete.firstChild.style.top = `${
                rect.top - this.autocomplete.firstChild.offsetHeight - 2
            }px`;
        } else {
            this.autocomplete.firstChild.style.top = `${rect.top + this.target.offsetHeight + 2}px`;
        }

        this.autocomplete.firstChild.style.left = `${rect.left}px`;
    }

    boldString(string, substring) {
        const index = string.toLowerCase().indexOf(substring.toLowerCase());
        if (index === -1) {
            return string;
        }
        return (
            string.substring(0, index) +
            "<b>" +
            string.substring(index, index + substring.length) +
            "</b>" +
            string.substring(index + substring.length)
        );
    }

    close() {
        if (!this.isSelect) {
            this.target.value = "";
            this.callback(null);
        }

        this.isSelect = false;
        this.isClose = false;

        this.autocomplete.remove();
    }

    createSearchIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 24 24");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
            "d",
            "M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"
        );
        svg.appendChild(path);

        return svg;
    }

    createArrowIcon() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("fill", "currentColor");
        svg.setAttribute("viewBox", "0 0 16 16");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
            "d",
            "M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
        );
        svg.appendChild(path);

        return svg;
    }
}

export default Autocomplete;
