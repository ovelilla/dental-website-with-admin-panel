<?php

namespace Models;

class Invoice {
    private string $table = 'invoices';
    private array $columns = ['id', 'budget_id', 'number', 'created_at'];

    private ?int $id;
    private string $budget_id;
    private string $number;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->budget_id = $args['budget_id'] ?? '';
        $this->number = $args['number'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getBudgetId(): string {
        return $this->budget_id;
    }

    public function setBudgetId(string $budget_id): void {
        $this->budget_id = $budget_id;
    }

    public function getNumber(): string {
        return $this->number;
    }

    public function setNumber(string $number): void {
        $this->number = $number;
    }

    public function getCreatedAt(): string {
        return $this->created_at;
    }

    public function setCreatedAt(string $created_at): void {
        $this->created_at = $created_at;
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
        if (empty($this->number)) {
            $this->errors['number'] = 'El número de factura es obligatorio';
        }
        return $this->errors;
    }
}
