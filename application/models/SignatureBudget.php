<?php

namespace Models;

class SignatureBudget {
    private string $table = 'signatures_budgets';
    private array $columns = ['id', 'budget_id', 'patient_id', 'signature', 'created_at'];

    private ?int $id;
    private int $budget_id;
    private int $patient_id;
    private string $signature;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->budget_id = $args['budget_id'] ?? 0;
        $this->patient_id = $args['patient_id'] ?? 0;
        $this->signature = $args['signature'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getBudgetId(): int {
        return $this->budget_id;
    }

    public function setBudgetId(int $budget_id): void {
        $this->budget_id = $budget_id;
    }

    public function getPatientId(): int {
        return $this->patient_id;
    }

    public function setPatientId(int $patient_id): void {
        $this->patient_id = $patient_id;
    }

    public function getSignature(): string {
        return $this->signature;
    }

    public function setSignature(string $signature): void {
        $this->signature = $signature;
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

    public function setData(array $data): void {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
            }
        }
    }
}
