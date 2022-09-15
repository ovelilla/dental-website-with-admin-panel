<?php

namespace Models;

class Doctor {
    private string $table = 'doctors';
    private array $columns = ['id', 'name', 'surname', 'email', 'phone', 'number', 'created_at'];

    private ?int $id;
    private string $name;
    private string $surname;
    private string $email;
    private string $phone;
    private string $number;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->surname = $args['surname'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->phone = $args['phone'] ?? '';
        $this->number = $args['number'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
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

    public function getSurname(): string {
        return $this->surname;
    }

    public function setSurname(string $surname): void {
        $this->surname = $surname;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function getPhone(): string {
        return $this->phone;
    }

    public function setPhone(string $phone): void {
        $this->phone = $phone;
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
        if (!$this->name) {
            $this->errors['name'] = 'El nombre es obligatorio';
        }
        if ($this->email && !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'El email no es válido';
        }

        return $this->errors;
    }
}
