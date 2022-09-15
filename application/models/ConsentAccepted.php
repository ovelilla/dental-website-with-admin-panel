<?php

namespace Models;

class ConsentAccepted {
    private string $table = 'consents_accepted';
    private array $columns = ['id', 'consent_id', 'patient_id', 'doctor_id', 'representative_name', 'representative_nif', 'created_at'];

    private ?int $id;
    private int $consent_id;
    private int $patient_id;
    private int $doctor_id;
    private string $representative_name;
    private string $representative_nif;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->consent_id = $args['consent_id'] ?? 0;
        $this->patient_id = $args['patient_id'] ?? 0;
        $this->doctor_id = $args['doctor_id'] ?? 0;
        $this->representative_name = $args['representative_name'] ?? '';
        $this->representative_nif = $args['representative_nif'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }
    
    public function getConsentId(): int {
        return $this->consent_id;
    }

    public function setConsentId(int $consent_id): void {
        $this->consent_id = $consent_id;
    }

    public function getPatientId(): int {
        return $this->patient_id;
    }

    public function setPatientId(int $patient_id): void {
        $this->patient_id = $patient_id;
    }

    public function getDoctorId(): int {
        return $this->doctor_id;
    }

    public function setDoctorId(int $doctor_id): void {
        $this->doctor_id = $doctor_id;
    }

    public function getRepresentativeName(): string {
        return $this->representative_name;
    }

    public function setRepresentativeName(string $representative_name): void {
        $this->representative_name = $representative_name;
    }

    public function getRepresentativeNif(): string {
        return $this->representative_nif;
    }

    public function setRepresentativeNif(string $representative_nif): void {
        $this->representative_nif = $representative_nif;
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
