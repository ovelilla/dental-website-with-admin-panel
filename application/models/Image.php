<?php

namespace Models;

class Image {
    private string $table = 'images';
    private array $columns = ['id', 'src', 'alt'];

    private ?int $id;
    private string $src;
    private string $alt;

    private string $key;

    private array $errors = [];

    public function __construct($args = [], $key) {
        $this->id = $args['id'] ?? null;
        $this->src = $args['src'] ?? '';
        $this->alt = $args[$key] ?? '';

        $this->key = $key;
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getSrc(): string {
        return $this->src;
    }

    public function setSrc(string $src): void {
        $this->src = $src;
    }

    public function getAlt(): string {
        return $this->alt;
    }

    public function setAlt(string $alt): void {
        $this->alt = $alt;
    }

    public function getError($key): string {
        return $this->errors[$key] ?? '';
    }

    public function setError($key, $value): void {
        $this->errors[$key] = $value;
    }

    public function getErrors(): array {
        return $this->errors;
    }

    public function setErrors(array $errors): void {
        $this->errors = $errors;
    }

    public function getData(): array {
        $data = [];
        foreach ($this->columns as $column) {
            if ($column === 'id') continue;
            $data[$column] = $this->$column;
        }
        return $data;
    }

    public function getTable(): string {
        return $this->table;
    }

    public function validate(): array {
        if (empty($this->alt)) {
            $this->errors[$this->key] = 'La descripción de la imagen es obligatoria';
        }

        return $this->errors;
    }
}
