<?php

namespace Models;

class Report {
    private string $table = 'reports';
    private array $columns = ['id', 'history_id', 'patient_id', 'date', 'description'];

    private ?int $id;
    private string $history_id;
    private string $patient_id;
    private string $date;
    private string $description;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->history_id = $args['history_id'] ?? '';
        $this->patient_id = $args['patient_id'] ?? '';
        $this->date = $args['date'] ?? '';
        $this->description = $args['description'] ?? '';
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function setId(?int $id): void {
        $this->id = $id;
    }
    
    public function getHistoryId(): string {
        return $this->history_id;
    }

    public function setHistoryId(string $history_id): void {
        $this->history_id = $history_id;
    }

    public function getPatientId(): string {
        return $this->patient_id;
    }

    public function setPatientId(string $patient_id): void {
        $this->patient_id = $patient_id;
    }

    public function getDate(): string {
        return $this->date;
    }

    public function setDate(string $date): void {
        $this->date = $date;
    }

    public function getDescription(): string {
        return $this->description;
    }

    public function setDescription(string $description): void {
        $this->description = $description;
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
        if (!$this->date) {
            $this->errors['date'] = 'La fecha es obligatoria';
        }
        if (!$this->description) {
            $this->errors['description'] = 'La description es obligatoria';
        }

        return $this->errors;
    }
}
