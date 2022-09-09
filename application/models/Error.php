<?php

namespace Models;

class Error {
    private array $errors = [];

    public function __construct($errors = []) {
        $this->errors = $errors;
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

    public function hasErrors(): bool {
        return !empty($this->errors);
    }
}
