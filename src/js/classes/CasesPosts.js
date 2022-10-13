import { popup, api } from "../app.js";
import Pagination from "./Pagination.js";
import Confirm from "./Confirm.js";
import BeforeAndAfter from "./BeforeAndAfter.js";
import { dateFormat } from "../helpers.js";
import { icon } from "../modules/Icon.js"

class CasesPosts {
    constructor() {
        this.posts = [];
        this.latestPosts = [];

        this.page = 1;
        this.limit = 5;
        this.total = 0;

        this.category = "";
        this.search = "";

        this.auth= false;

        this.init();
    }

    async init() {
        const posts = document.querySelector("#cases-posts");

        if (posts) {
            await this.readPosts();
            this.showPosts();
        }

        const postsByCategory = document.querySelector("#cases-posts-by-category");

        if (postsByCategory) {
            await this.readPostsByCategory();
            this.showPostsByCategory();
        }

        const postsBySearch = document.querySelector("#cases-posts-by-search");

        if (postsBySearch) {
            await this.readPostsBySearch();
            this.showPostsBySearch();
        }
    }

    setPosts(posts) {
        this.posts = posts;
    }

    setLatestPosts(latestPosts) {
        this.latestPosts = latestPosts;
    }

    setPage(page) {
        this.page = page;
    }

    setLimit(limit) {
        this.limit = limit;
    }

    setCategory(category) {
        this.category = category;
    }

    setSearch(search) {
        this.search = search;
    }

    setAuth(auth) {
        this.auth = auth;
    }

    setTotal(total) {
        this.total = total;
    }

    updatePost(updatedPost) {
        this.posts = this.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post));
    }

    deletePost(deletedPost) {
        this.posts = this.posts.filter((post) => post.id !== deletedPost.id);
    }

    clearPosts() {
        this.posts = [];
    }

    async readPosts() {
        const url = window.location.pathname;
        const urlArray = url.split("/");
        const pageExists = urlArray.includes("page");
        const page = pageExists ? Number(urlArray.pop()) : 1;

        this.setPage(page);
        this.setLimit(page === 1 ? 5 : 6);

        const data = {
            page: this.page,
            limit: this.limit,
        };

        const response = await api.post("/api/cases", data);

        if (response.status === "error") {
            return;
        }

        if (!response.posts.length && this.page > 1) {
            window.location.href = "/casos";
            return;
        }

        this.setPosts(response.posts);
        this.setTotal(response.total);
        this.setAuth(response.auth);
    }

    async readPostsByCategory() {
        const url = window.location.pathname;
        const urlArray = url.split("/");
        const pageExists = urlArray.includes("page");
        const category = pageExists ? urlArray[2] : urlArray.pop();
        const page = pageExists ? Number(urlArray.pop()) : 1;

        this.setCategory(category);
        this.setPage(page);
        this.setLimit(page === 1 ? 5 : 6);

        const data = {
            category: this.category,
            page: this.page,
            limit: this.limit,
        };

        const response = await api.post("/api/cases/category", data);

        if (response.status === "error") {
            return;
        }

        if (!response.posts.length && this.page > 1) {
            window.location.href = `/casos/${category}`;
            return;
        }

        this.setPosts(response.posts);
        this.setTotal(response.total);
        this.setAuth(response.auth);
    }

    async readPostsBySearch() {
        const url = window.location.pathname;
        const urlArray = url.split("/");
        const pageExists = urlArray.includes("page");
        const search = pageExists ? urlArray[3] : urlArray.pop();
        const page = pageExists ? Number(urlArray.pop()) : 1;

        this.setSearch(search);
        this.setPage(page);
        this.setLimit(page === 1 ? 5 : 6);

        const formatSearch = search.split("+").join(" ");

        const data = {
            search: formatSearch,
            page: this.page,
            limit: this.limit,
        };

        const response = await api.post("/api/cases/search", data);

        if (response.status === "error") {
            return;
        }

        if (!response.posts.length && this.page > 1) {
            window.location.href = `/casos/search/${search}`;
            return;
        }

        this.setPosts(response.posts);
        this.setTotal(response.total);
        this.setAuth(response.auth);
    }

    showPosts() {
        const postsContainer = document.querySelector("#cases-posts");
        const postsElements = this.createPosts();
        postsContainer.appendChild(postsElements);

        new Pagination(this.page, this.limit, this.total, "/casos");
    }

    showPostsByCategory() {
        const postsByCategoryContainer = document.querySelector("#cases-posts-by-category");
        const postsElements = this.createPosts();
        postsByCategoryContainer.appendChild(postsElements);

        new Pagination(this.page, this.limit, this.total, `/casos/${this.category}`);
    }

    showPostsBySearch() {
        const postsBySearchContainer = document.querySelector("#cases-posts-by-search");
        const postsElements = this.createPosts();
        postsBySearchContainer.appendChild(postsElements);

        new Pagination(this.page, this.limit, this.total, `/casos/search/${this.search}`);
    }

    createPosts() {
        const fragment = document.createDocumentFragment();

        if (!this.posts.length) {
            const message = document.createElement("p");
            message.textContent = "No se encontraron posts";
            fragment.appendChild(message);
        }

        this.posts.forEach((post, index) => {
            const postElement = this.createPost(post, index);
            fragment.appendChild(postElement);
        });

        return fragment;
    }

    createPost(post, index) {
        const article = document.createElement("article");
        if (this.page === 1 && index === 0) {
            article.classList.add("post-big");
        }

        const image = document.createElement("div");
        image.classList.add("image");
        article.appendChild(image);

        const beforeImg = document.createElement("img");
        beforeImg.src = post.images.before.src;
        beforeImg.alt = post.images.before.alt;

        const afterImg = document.createElement("img");
        afterImg.src = post.images.after.src;
        afterImg.alt = post.images.after.alt;

        this.beforeAndAfter = new BeforeAndAfter(image, beforeImg, afterImg);

        const title = document.createElement("h2");
        title.classList.add("title");
        article.appendChild(title);

        const titleAnchor = document.createElement("a");
        titleAnchor.href = `/casos/${post.category_alias}/${post.alias}`;
        titleAnchor.textContent = post.title;
        title.appendChild(titleAnchor);

        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = post.description;
        article.appendChild(description);

        const row = document.createElement("div");
        row.classList.add("row");
        article.appendChild(row);

        const date = document.createElement("time");
        date.classList.add("date");
        date.textContent = dateFormat(post.created_at);
        row.appendChild(date);

        const author = document.createElement("a");
        author.classList.add("author");
        author.textContent = `By ${post.author}`;
        author.href = "/casos";
        row.appendChild(author);

        if (this.auth) {
            const actions = document.createElement("div");
            actions.classList.add("actions");
            row.appendChild(actions);

            const edit = document.createElement("a");
            edit.classList.add("edit");
            edit.href = `/editor/casos/${post.alias}`;
            actions.appendChild(edit);

            const editIcon = icon.get("pencilSquare");
            edit.appendChild(editIcon);

            const remove = document.createElement("button");
            remove.classList.add("remove");
            remove.addEventListener("click", this.deletePost.bind(this, post));
            actions.appendChild(remove);

            const removeIcon = icon.get("trash");
            remove.appendChild(removeIcon);
        }

        if (this.page === 1 && index === 0) {
            const readMore = document.createElement("a");
            readMore.classList.add("read-more");
            readMore.href = `/casos/${post.category_alias}/${post.alias}`;
            row.appendChild(readMore);

            const span = document.createElement("span");
            span.textContent = "Leer más";
            readMore.appendChild(span);

            const arrowRight = icon.get("arrowRight");
            readMore.appendChild(arrowRight);
        }

        return article;
    }

    async deletePost(post) {
        const confirm = new Confirm({
            title: "¿Eliminar post?",
            description:
                "¿Estás seguro de eliminar este post? Los datos no podrán ser recuperados.",
            accept: "Eliminar",
            cancel: "Cancelar",
        });
        const confirmResponse = await confirm.question();
        
        if (!confirmResponse) {
            return;
        }

        const data = {
            id: post.id,
            before_id: post.before_id,
            after_id: post.after_id,
        };

        const response = await api.delete("/api/cases", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Post eliminado correctamente!",
            message: "Serás redirigido a los casos",
            timer: 3000,
        });

        window.location.href = "/casos";
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

export default CasesPosts;
