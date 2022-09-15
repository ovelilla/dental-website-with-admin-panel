<?php

namespace Models;

class Signature {
    private string $table = 'signatures';
    private array $columns = ['id', 'consent_id', 'patient_id', 'signature', 'created_at'];

    private ?int $id;
    private string $consent_id;
    private string $patient_id;
    private string $signature;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->consent_id = $args['consent_id'] ?? '';
        $this->patient_id = $args['patient_id'] ?? '';
        $this->signature = $args['signature'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getConsentId(): string {
        return $this->consent_id;
    }

    public function setConsentId(string $consent_id): void {
        $this->consent_id = $consent_id;
    }

    public function getPatientId(): string {
        return $this->patient_id;
    }

    public function setPatientId(string $patient_id): void {
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
}
