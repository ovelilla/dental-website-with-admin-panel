import { icon } from "../modules/Icon.js";

class Pagination {
    constructor(page, limit, total, url) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.url = url;

        if (this.limit === 5) {
            this.pages = Math.ceil(this.total / this.limit);
        } else {
            this.pages = 1 + Math.ceil((this.total - 5) / this.limit);
        }

        this.pagination = [];

        this.init();
    }

    init() {
        this.setPagination();
        this.showPagination();
    }

    setPagination() {
        if (this.pages > 1) {
            if (this.page === 1) {
                this.pagination.push({ type: "first", active: false, page: "" });
                this.pagination.push({ type: "prev", active: false, page: "" });
            } else {
                this.pagination.push({ type: "first", active: true, page: 1 });
                this.pagination.push({ type: "prev", active: true, page: this.page - 1 });
            }

            if (this.pages < 8) {
                for (let i = 1; i <= this.pages; i++) {
                    if (this.page === i) {
                        this.pagination.push({ type: "current", active: false, page: i });
                    } else {
                        this.pagination.push({ type: "page", active: true, page: i });
                    }
                }
            }

            if (this.pages >= 8) {
                if (this.page < 5) {
                    for (let i = 1; i <= 5; i++) {
                        if (i > this.pages) {
                            break;
                        }

                        if (this.page === i) {
                            this.pagination.push({ type: "current", active: false, page: i });
                        } else {
                            this.pagination.push({ type: "page", active: true, page: i });
                        }
                    }
                }

                if (this.page >= 5) {
                    this.pagination.push({ type: "page", active: true, page: 1 });
                    this.pagination.push({ type: "dots" });
                }

                if (this.page >= 5 && this.page < this.pages - 3) {
                    for (let i = this.page - 1; i <= this.page + 1; i++) {
                        if (this.page === i) {
                            this.pagination.push({ type: "current", active: false, page: i });
                        } else {
                            this.pagination.push({ type: "page", active: true, page: i });
                        }
                    }
                }

                if (this.page < this.pages - 3) {
                    this.pagination.push({ type: "dots" });
                    this.pagination.push({ type: "page", active: true, page: this.pages });
                }

                if (this.page >= this.pages - 3) {
                    for (let i = this.pages - 4; i <= this.pages; i++) {
                        if (i > this.pages) {
                            break;
                        }
                        if (this.page === i) {
                            this.pagination.push({ type: "current", active: false, page: i });
                        } else {
                            this.pagination.push({ type: "page", active: true, page: i });
                        }
                    }
                }
            }

            if (this.page < this.pages) {
                this.pagination.push({ type: "next", active: true, page: this.page + 1 });
                this.pagination.push({ type: "last", active: true, page: this.pages });
            } else {
                this.pagination.push({ type: "next", active: false, page: "" });
                this.pagination.push({ type: "last", active: false, page: "" });
            }
        } else {
            this.pagination.push({ type: "first", active: false, page: "" });
            this.pagination.push({ type: "prev", active: false, page: "" });
            this.pagination.push({ type: "next", active: false, page: "" });
            this.pagination.push({ type: "last", active: false, page: "" });
        }
    }

    showPagination() {
        const paginationContainer = document.querySelector("#pagination");
        const paginationElements = this.createPagination();
        paginationContainer.appendChild(paginationElements);
    }

    createPagination() {
        const fragment = document.createDocumentFragment();

        this.pagination.forEach((item) => {
            const paginationElement = document.createElement("div");
            paginationElement.classList.add(item.type);
            paginationElement.classList.add(item.active ? "active" : "inactive");
            fragment.appendChild(paginationElement);

            const anchor = document.createElement("a");
            if (item.page === 1) {
                anchor.href = `${this.url}`;
            } else {
                anchor.href = `${this.url}/page/${item.page}`;
            }

            paginationElement.appendChild(anchor);

            if (item.type === "first") {
                anchor.appendChild(icon.get("chevronDoubleLeft"));
            }

            if (item.type === "prev") {
                anchor.appendChild(icon.get("chevronLeft"));
            }

            if (item.type === "page" || item.type === "current") {
                anchor.textContent = item.page;
            }

            if (item.type === "dots") {
                anchor.appendChild(icon.get("threeDots"));
            }

            if (item.type === "next") {
                anchor.appendChild(icon.get("chevronRight"));
            }

            if (item.type === "last") {
                anchor.appendChild(icon.get("chevronDoubleRight"));
            }
        });

        return fragment;
    }
}

export default Pagination;
