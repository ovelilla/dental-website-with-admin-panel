import Input from "./mio/Input.js";
import { icon } from "../modules/Icon.js";

class CasesSearch {
    constructor() {
        this.init();
    }

    init() {
        const searchForm = document.querySelector("#cases-search-form");

        if (searchForm) {
            this.createSearch();
        }
    }

    createSearch() {
        const form = document.querySelector("#cases-search-form");
        form.addEventListener("submit", this.handleSearch.bind(this));

        const search = new Input({
            label: {
                text: "Buscar",
                for: "search",
            },
            input: {
                type: "text",
                name: "search",
                id: "search",
            },
        });

        const searchField = search.getField();
        form.appendChild(searchField);

        const field = document.createElement("div");
        field.classList.add("field");
        form.appendChild(field);

        const button = document.createElement("button");
        button.classList.add("btn", "primary-btn");
        button.type = "submit";
        button.ariaLabel = "Buscar";
        field.appendChild(button);

        const searchIcon = icon.get("search");
        button.appendChild(searchIcon);
    }

    async handleSearch(e) {
        e.preventDefault();

        const data = new FormData(e.target);
        const entries = Object.fromEntries(data);

        const search = entries.search.trim().toLowerCase().split(" ").join("+");

        window.location.href = `/casos/search/${search}`;
    }
}

export default CasesSearch;
