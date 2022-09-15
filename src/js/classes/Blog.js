import BlogPost from "./BlogPost.js";
import BlogPosts from "./BlogPosts.js";
import BlogSearch from "./BlogSearch.js";
import BlogCategories from "./BlogCategories.js";
import BlogEditor from "./BlogEditor.js";

class Blog {
    constructor() {
        this.post = new BlogPost();
        this.posts = new BlogPosts();
        this.search = new BlogSearch();
        this.categories = new BlogCategories();
        this.editor = new BlogEditor();
    }
}

export default Blog;
