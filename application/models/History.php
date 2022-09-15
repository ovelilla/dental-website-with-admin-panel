<?php

namespace Models;

class History {
    private string $table = 'histories';
    private array $columns = ['id', 'patient_id', 'examination'];

    private ?int $id;
    private string $patient_id;
    private string $examination;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->patient_id = $args['patient_id'] ?? '';
        $this->examination = $args['examination'] ?? '';
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function setId(?int $id): void {
        $this->id = $id;
    }

    public function getPatientId(): string {
        return $this->patient_id;
    }

    public function setPatientId(string $patient_id): void {
        $this->patient_id = $patient_id;
    }

    public function getExamination(): string {
        return $this->examination;
    }

    public function setExamination(string $examination): void {
        $this->examination = $examination;
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
        if (!$this->examination) {
            $this->errors['examination'] = 'La exploración es obligatoria';
        }

        return $this->errors;
    }
}
