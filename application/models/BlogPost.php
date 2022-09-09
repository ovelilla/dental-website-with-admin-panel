<?php

namespace Models;

class BlogPost {
    private string $table = 'blog_posts';
    private array $columns = ['id', 'user_id', 'image_id', 'category_id', 'title', 'alias', 'description', 'html', 'created_at', 'updated_at'];

    private ?int $id;
    private string $user_id;
    private string $image_id;
    private string $category_id;
    private string $title;
    private string $alias;
    private string $description;
    private string $html;
    private string $created_at;
    private string $updated_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->user_id = $args['user_id'] ?? '';
        $this->image_id = $args['image_id'] ?? '';
        $this->category_id = $args['category_id'] ?? '';
        $this->title = $args['title'] ?? '';
        $this->alias = $args['alias'] ?? '';
        $this->description = $args['description'] ?? '';
        $this->html = $args['html'] ?? '';
        $this->created_at = $args['created_at'] ?? '';
        $this->updated_at = $args['updated_at'] ?? '';
    }

    public function getId(): ?int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getUserId(): string {
        return $this->user_id;
    }

    public function setUserId(string $user_id): void {
        $this->user_id = $user_id;
    }

    public function getImageId(): string {
        return $this->image_id;
    }

    public function setImageId(string $image_id): void {
        $this->image_id = $image_id;
    }

    public function getCategoryId(): string {
        return $this->category_id;
    }

    public function setCategoryId(string $category_id): void {
        $this->category_id = $category_id;
    }

    public function getTitle(): string {
        return $this->title;
    }

    public function setTitle(string $title): void {
        $this->title = $title;
    }

    public function getAlias(): string {
        return $this->alias;
    }

    public function setAlias(string $alias): void {
        $this->alias = $alias;
    }

    public function getDescription(): string {
        return $this->description;
    }

    public function setDescription(string $description): void {
        $this->description = $description;
    }

    public function getHtml(): string {
        return $this->html;
    }

    public function setHtml(string $html): void {
        $this->html = $html;
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

    public function getTable(): string {
        return $this->table;
    }

    public function validate(): array {
        if (empty($this->title)) {
            $this->errors['title'] = 'El título es obligatorio';
        }

        if (empty($this->description)) {
            $this->errors['description'] = 'La descripción es obligatoria';
        }

        if (empty($this->category_id)) {
            $this->errors['category_id'] = 'La categoría es obligatoria';
        }

        if (empty($this->html)) {
            $this->errors['html'] = 'El contenido es obligatorio';
        }

        return $this->errors;
    }

    public function getSlugTitle(): string {
        return slugify($this->title);
    }
}
