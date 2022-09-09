<?php

namespace Models;

class Budget {
    private string $table = 'budgets';
    private array $columns = ['id', 'patient_id', 'comment', 'created_at'];

    private ?int $id;
    private string $patient_id;
    private string $comment;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->patient_id = $args['patient_id'] ?? '';
        $this->comment = $args['comment'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }
    
    public function getPatientId(): string {
        return $this->patient_id;
    }

    public function setPatientId(string $patient_id): void {
        $this->patient_id = $patient_id;
    }

    public function getComment(): string {
        return $this->comment;
    }

    public function setComment(string $comment): void {
        $this->comment = $comment;
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
        if (empty($this->patient_id)) {
            $this->errors['patient'] = 'El paciente no puede estar vacío';
        }
        return $this->errors;
    }
}
