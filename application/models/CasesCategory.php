<?php

namespace Models;

class CasesCategory {
    private string $table = 'cases_categories';
    private array $columns = ['id', 'name', 'alias'];

    private ?int $id;
    private string $name;
    private string $alias;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->alias = $args['alias'] ?? '';
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function getAlias(): string {
        return $this->alias;
    }

    public function setAlias(string $alias): void {
        $this->alias = $alias;
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

    public function getSlugName(): string {
        return slugify($this->name);
    }

    public function validate(): array {
        if (empty($this->name)) {
            $this->errors['name'] = 'El nombre no puede estar vacío';
        }
        if (empty($this->alias)) {
            $this->errors['alias'] = 'El alias no puede estar vacío';
        }
        return $this->errors;
    }
}
