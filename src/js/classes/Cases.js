import CasesPost from "./CasesPost.js";
import CasesPosts from "./CasesPosts.js";
import CasesSearch from "./CasesSearch.js";
import CasesCategories from "./CasesCategories.js";
import CasesEditor from "./CasesEditor.js";

class Cases {
    constructor() {
        this.post = new CasesPost();
        this.posts = new CasesPosts();
        this.search = new CasesSearch();
        this.categories = new CasesCategories();
        this.editor = new CasesEditor();
    }
}

export default Cases;
