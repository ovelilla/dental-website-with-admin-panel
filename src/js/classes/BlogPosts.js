import { popup, api } from "../app.js";
import Pagination from "./Pagination.js";
import Confirm from "./Confirm.js";
import { icon } from "../modules/Icon.js";
import { dateFormat } from "../helpers.js";

class BlogPosts {
    constructor() {
        this.posts = [];
        this.latestPosts = [];

        this.page = 1;
        this.limit = 5;
        this.total = 0;

        this.category = "";
        this.search = "";

        this.auth = false;

        this.init();
    }

    async init() {
        const posts = document.querySelector("#blog-posts");

        if (posts) {
            await this.readPosts();
            this.showPosts();
        }

        const postsByCategory = document.querySelector("#blog-posts-by-category");

        if (postsByCategory) {
            await this.readPostsByCategory();
            this.showPostsByCategory();
        }

        const postsBySearch = document.querySelector("#blog-posts-by-search");

        if (postsBySearch) {
            await this.readPostsBySearch();
            this.showPostsBySearch();
        }

        const latestPosts = document.querySelector("#blog-latest-posts");

        if (latestPosts) {
            await this.readLatestPosts();
            this.showLatestPosts();
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

        const response = await api.post("/api/blog", data);

        if (response.status === "error") {
            return;
        }

        if (!response.posts.length && this.page > 1) {
            window.location.href = "/blog";
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

        const response = await api.post("/api/blog/category", data);

        if (response.status === "error") {
            return;
        }

        if (!response.posts.length && this.page > 1) {
            window.location.href = `/blog/${category}`;
            return;
        }

        this.setPosts(response.posts);
        this.setTotal(response.total);
        this.setAuth(response.auth);
    }

    async readLatestPosts() {
        const response = await api.get("/api/blog/latest");

        if (response.status === "error") {
            return;
        }

        this.setLatestPosts(response.posts);
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

        const response = await api.post("/api/blog/search", data);

        if (response.status === "error") {
            return;
        }

        if (!response.posts.length && this.page > 1) {
            window.location.href = `/blog/search/${search}`;
            return;
        }

        this.setPosts(response.posts);
        this.setTotal(response.total);
        this.setAuth(response.auth);
    }

    showPosts() {
        const postsContainer = document.querySelector("#blog-posts");
        const postsElements = this.createPosts();
        postsContainer.appendChild(postsElements);

        new Pagination(this.page, this.limit, this.total, "/blog");
    }

    showPostsByCategory() {
        const postsByCategoryContainer = document.querySelector("#blog-posts-by-category");
        const postsElements = this.createPosts();
        postsByCategoryContainer.appendChild(postsElements);

        new Pagination(this.page, this.limit, this.total, `/blog/${this.category}`);
    }

    showPostsBySearch() {
        const postsBySearchContainer = document.querySelector("#blog-posts-by-search");
        const postsElements = this.createPosts();
        postsBySearchContainer.appendChild(postsElements);

        new Pagination(this.page, this.limit, this.total, `/blog/search/${this.search}`);
    }

    showLatestPosts() {
        const latestPostsContainer = document.querySelector("#blog-latest-posts");
        const latestPosts = this.createLatestPosts();
        latestPostsContainer.appendChild(latestPosts);
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

        const img = document.createElement("img");
        img.src = post.src;
        img.alt = post.alt;
        image.appendChild(img);

        const title = document.createElement("h2");
        title.classList.add("title");
        article.appendChild(title);

        const titleAnchor = document.createElement("a");
        titleAnchor.href = `/blog/${post.category_alias}/${post.alias}`;
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
        author.href = "/blog";
        row.appendChild(author);

        if (this.auth) {
            const actions = document.createElement("div");
            actions.classList.add("actions");
            row.appendChild(actions);

            const edit = document.createElement("a");
            edit.classList.add("edit");
            edit.href = `/editor/blog/${post.alias}`;
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
            readMore.href = `/blog/${post.category_alias}/${post.alias}`;
            row.appendChild(readMore);

            const span = document.createElement("span");
            span.textContent = "Leer más";
            readMore.appendChild(span);

            const arrowRight = icon.get("arrowRight");
            readMore.appendChild(arrowRight);
        }

        return article;
    }

    createLatestPosts() {
        const fragment = document.createDocumentFragment();

        this.latestPosts.forEach((post, index) => {
            const latestPost = this.createLatestPost(post, index);
            fragment.appendChild(latestPost);
        });

        return fragment;
    }

    createLatestPost(post) {
        const anchor = document.createElement("a");
        anchor.href = `/blog/${post.category_alias}/${post.alias}`;

        const article = document.createElement("article");
        anchor.appendChild(article);

        const row = document.createElement("div");
        row.classList.add("row");
        article.appendChild(row);

        const date = document.createElement("time");
        date.classList.add("date");
        date.textContent = dateFormat(post.created_at);
        row.appendChild(date);

        const author = document.createElement("p");
        author.classList.add("author");
        author.textContent = `By ${post.author}`;
        row.appendChild(author);

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = post.title;
        article.appendChild(title);

        return anchor;
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
            image_id: post.image_id,
        };

        const response = await api.delete("/api/blog", data);

        if (response.status === "error") {
            return;
        }

        await popup.open({
            type: "success",
            title: "¡Post eliminado correctamente!",
            message: "Serás redirigido al blog",
            timer: 3000,
        });

        window.location.href = "/blog";
    }
}

export default BlogPosts;
