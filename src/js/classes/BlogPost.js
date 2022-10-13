import { popup, api } from "../app.js";
import { icon } from "../modules/Icon.js";
import Confirm from "./Confirm.js";

class BlogPost {
    constructor(post) {
        this.post = post || null;
        this.auth = false;

        this.init();
    }

    async init() {
        const post = document.querySelector("#blog-post");

        if (post) {
            await this.readPost();
            this.showPost();
        }
    }

    setPost(post) {
        this.post = post;
    }

    setAuth(auth) {
        this.auth = auth;
    }

    async readPost() {
        const post = window.location.pathname.split("/").pop();

        const response = await api.get(`/api/blog/post/${post}`);
        
        if (response.status === "error") {
            return;
        }

        this.setPost(response.post);
        this.setAuth(response.auth);
    }

    showPost() {
        const postContainer = document.querySelector("#blog-post");
        const postElement = this.createPost();
        postContainer.appendChild(postElement);
    }

    createPost() {
        const article = document.createElement("article");

        const header = document.createElement("header");
        article.appendChild(header);

        const h1 = document.createElement("h1");
        h1.textContent = this.post.title;
        header.appendChild(h1);
  
        if (this.auth) {
            const actions = document.createElement("div");
            actions.classList.add("actions");
            header.appendChild(actions);

            const edit = document.createElement("a");
            edit.classList.add("edit");
            edit.href = `/editor/blog/${this.post.alias}`;
            actions.appendChild(edit);

            const editIcon = icon.get("pencilSquare");
            edit.appendChild(editIcon);

            const remove = document.createElement("button");
            remove.classList.add("remove");
            remove.addEventListener("click", this.deletePost.bind(this, this.post));
            actions.appendChild(remove);

            const removeIcon = icon.get("trash");
            remove.appendChild(removeIcon);
        }

        const body = document.createElement("div");
        body.classList.add("body");
        body.innerHTML = this.post.html;
        article.appendChild(body);

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

export default BlogPost;
