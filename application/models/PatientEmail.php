<?php

namespace Models;

class PatientEmail {
    private string $subject;
    private string $header;
    private string $body;
    private string $footer;

    private array $errors = [];

    public function __construct($args = []) {
        $this->subject = $args['subject'] ?? '';
        $this->header = $args['header'] ?? '';
        $this->body = $args['body'] ?? '';
        $this->footer = $args['footer'] ?? '';
    }

    public function getSubject(): string {
        return $this->subject;
    }

    public function setSubject(string $subject): void {
        $this->subject = $subject;
    }

    public function getHeader(): string {
        return $this->header;
    }

    public function setHeader(string $header): void {
        $this->header = $header;
    }

    public function getBody(): string {
        return $this->body;
    }

    public function setBody(string $body): void {
        $this->body = $body;
    }

    public function getFooter(): string {
        return $this->footer;
    }

    public function setFooter(string $footer): void {
        $this->footer = $footer;
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
        if (!$this->subject) {
            $this->setError('subject', 'El asunto es obligatorio');
        }

        if (!$this->header) {
            $this->setError('header', 'El encabezado es obligatorio');
        }

        if (!$this->body) {
            $this->setError('body', 'El mensaje es obligatorio');
        }

        if (!$this->footer) {
            $this->setError('footer', 'La despedida es obligatoria');
        }

        return $this->errors;
    }
}
