class Api {
    constructor() {
        this.config = {
            headers: {
                Accept: "*/*",
            },
        };
    }

    async request(url) {
        try {
            const response = await fetch(url, this.config);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    get(url) {
        this.config.method = "GET";
        this.config.body = null;
        return this.request(url);
    }

    post(url, data) {
        this.config.method = "POST";
        this.config.body = this.isFormData(data) ? data : JSON.stringify(data);
        return this.request(url);
    }

    put(url, data) {
        this.config.method = "PUT";
        this.config.body = this.isFormData(data) ? data : JSON.stringify(data);
        return this.request(url);
    }

    delete(url, data) {
        this.config.method = "DELETE";
        this.config.body = this.isFormData(data) ? data : JSON.stringify(data);
        return this.request(url);
    }

    isFormData(data) {
        return data instanceof FormData;
    }
}

export default Api;
