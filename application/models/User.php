<?php

namespace Models;

class User {
    public string $table = 'users';
    public array $columns = ['id', 'name', 'email', 'password', 'role_id', 'token', 'confirmed', 'created_at', 'updated_at'];

    public ?int $id;
    public string $name;
    public string $email;
    public string $password;
    public string $role_id;
    public string $token;
    public string $confirmed;
    public string $created_at;
    public string $updated_at;

    public array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->password = $args['password'] ?? '';
        $this->role_id = $args['role_id'] ?? '';
        $this->token = $args['token'] ?? '';
        $this->confirmed = $args['confirmed'] ?? 1;
        $this->created_at = $args['created_at'] ?? '';
        $this->updated_at = $args['updated_at'] ?? '';
    }

    public function getId(): string {
        return $this->id;
    }

    public function setId(string $id): void {
        $this->id = $id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function setName(string $name): void {
        $this->name = $name;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function getRoleId(): string {
        return $this->role_id;
    }

    public function setRoleId(string $role_id): void {
        $this->role_id = $role_id;
    }

    public function getToken(): string {
        return $this->token;
    }

    public function setToken(string $token): void {
        $this->token = $token;
    }

    public function getConfirmed(): string {
        return $this->confirmed;
    }

    public function setConfirmed(int $confirmed): void {
        $this->confirmed = $confirmed;
    }

    public function getCreatedAt(): string {
        return $this->created_at;
    }

    public function setCreatedAt(string $created_at): void {
        $this->created_at = $created_at;
    }

    public function getUpdatedAt(): string {
        return $this->updated_at;
    }

    public function setUpdatedAt(string $updated_at): void {
        $this->updated_at = $updated_at;
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

    public function setData(array $data): void {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
            }
        }
    }

    public function getFullData(): array {
        $data = [];
        foreach ($this->columns as $column) {
            $data[$column] = $this->$column;
        }
        return $data;
    }

    public function getTable(): string {
        return $this->table;
    }

    public function validateName(): void {
        if (!$this->name) {
            $this->errors['name'] = 'El nombre es obligatorio';
        }
    }

    public function validateEmail(): void {
        if (!$this->email) {
            $this->errors['email'] = 'El email es obligatorio';
        }
        if ($this->email && !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'El email no es válido';
        }
    }

    public function validatePassword(): void {
        if (!$this->password) {
            $this->errors['password'] = 'La contraseña es obligatoria';
        }
        if ($this->password && strlen($this->password) < 6) {
            $this->errors['password'] = 'El password debe contener al menos 6 caracteres';
        }
    }

    public function validateRegister(): array {
        $this->validateName();
        $this->validateEmail();
        $this->validatePassword();

        return $this->errors;
    }

    public function validateLogin(): array {
        $this->validateEmail();
        $this->validatePassword();

        return $this->errors;
    }

    public function validateRecover(): array {
        $this->validateEmail();

        return $this->errors;
    }

    public function validateRestore(): array {
        $this->validatePassword();

        return $this->errors;
    }

    public function checkPassword($password): bool {
        return password_verify($password, $this->password);
    }

    public function hashPassword(): void {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    public function createToken(): void {
        $this->token = randomId(64);
    }
}
