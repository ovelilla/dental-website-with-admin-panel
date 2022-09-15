class UploadAdapter {
    constructor(loader, src) {
        this.loader = loader;
        this.url = `/api/editor/${src}/upload/image`;
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    this._initRequest();
                    this._initListeners(resolve, reject, file);
                    this._sendRequest(file);
                })
        );
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = (this.xhr = new XMLHttpRequest());
        xhr.open("POST", this.url, true);
        xhr.responseType = "json";
    }

    _initListeners(resolve, reject, file) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `No se ha podido subir la imagen: ${file.name}.`;

        xhr.addEventListener("error", () => reject(genericErrorText));
        xhr.addEventListener("abort", () => reject());
        xhr.addEventListener("load", () => {
            const response = xhr.response;

            if (!response || response.response === "error") {
                return reject(
                    response && response.response === "error"
                        ? response.response.msg
                        : genericErrorText
                );
            }

            resolve({
                default: response.url,
            });
        });

        if (xhr.upload) {
            xhr.upload.addEventListener("progress", (e) => {
                if (e.lengthComputable) {
                    loader.uploadTotal = e.total;
                    loader.uploaded = e.loaded;
                }
            });
        }
    }

    _sendRequest(file) {
        const data = new FormData();
        data.append("image", file);
        data.append("action", "uploadImage");
        this.xhr.send(data);
    }
}

export function BlogUploadAdapter(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, 'blog');
    };
}

export function CasesUploadAdapter(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new UploadAdapter(loader, 'cases');
    };
}
