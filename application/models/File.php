<?php

namespace Models;

class File {
    private int $error;
    private string $full_path;
    private string $name;
    private string $size;
    private string $tmp_name;
    private string $type;

    private string $key;
    private string $destination;

    public function __construct($args = [], $key = '', $destination = '') {
        $this->error = $args['error'];
        $this->name = $args['name'];
        $this->size = $args['size'];
        $this->tmp_name = $args['tmp_name'];
        $this->type = $args['type'];
        
        $this->key = $key;
        $this->destination = $_SERVER['DOCUMENT_ROOT'] . $destination;
    }

    public function getError(): int {
        return $this->error;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getSize(): string {
        return $this->size;
    }

    public function getTmpName(): string {
        return $this->tmp_name;
    }

    public function getType(): string {
        return $this->type;
    }

    public function getKey(): string {
        return $this->key;
    }

    public function getDestination(): string {
        return $this->destination;
    }

    public function isImage(): bool {
        return in_array($this->type, ['image/jpeg', 'image/png', 'image/gif']);
    }

    public function isValid(): bool {
        return $this->error === UPLOAD_ERR_OK;
    }

    public function move(): bool {
        if (!is_dir($this->destination)) {
            mkdir($this->destination, 0777, true);
        }
        return move_uploaded_file($this->tmp_name, $this->destination . $this->getSlugName());
    }

    public function validate(): array {
        $errors = [];

        if ($this->error === UPLOAD_ERR_INI_SIZE) {
            $errors[$this->key] = 'El archivo es demasiado grande';
        } else if ($this->error === UPLOAD_ERR_FORM_SIZE) {
            $errors[$this->key] = 'El archivo es demasiado grande';
        } else if ($this->error === UPLOAD_ERR_PARTIAL) {
            $errors[$this->key] = 'El archivo no se ha podido subir completamente';
        } else if ($this->error === UPLOAD_ERR_NO_FILE) {
            $errors[$this->key] = 'No se ha subido ningún archivo';
        } else if ($this->error === UPLOAD_ERR_NO_TMP_DIR) {
            $errors[$this->key] = 'No se ha podido crear el directorio temporal';
        } else if ($this->error === UPLOAD_ERR_CANT_WRITE) {
            $errors[$this->key] = 'No se ha podido escribir el archivo en el disco';
        } else if ($this->error === UPLOAD_ERR_EXTENSION) {
            $errors[$this->key] = 'La extensión del archivo no es válida';
        } else if (!$this->isImage()) {
            $errors[$this->key] = 'El archivo no es una imagen';
        } else if ($this->size > 1000000) {
            $errors[$this->key] = 'El archivo es demasiado grande';
        }

        return $errors;
    }

    public function getExtension(): string {
        return pathinfo($this->name, PATHINFO_EXTENSION);
    }

    public function getFilename(): string {
        return pathinfo($this->name, PATHINFO_FILENAME);
    }

    public function getBasename(): string {
        return pathinfo($this->name, PATHINFO_BASENAME);
    }

    public function getSlugName(): string {
        return slugify($this->getFilename()) . '.' . $this->getExtension();
    }
}
