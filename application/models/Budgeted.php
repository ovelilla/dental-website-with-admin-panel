<?php

namespace Models;

class Budgeted {
    private string $table = 'budgeted';
    private array $columns = ['id', 'budget_id', 'treatment_id', 'piece', 'unit_price', 'discount', 'total_price'];

    private ?int $id;
    private string $budget_id;
    private string $treatment_id;
    private string $piece;
    private float $unit_price;
    private int $discount;
    private float $total_price;

    private array $selected_pieces;
    private array $selected_group;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->budget_id = $args['budget_id'] ?? '';
        $this->treatment_id = $args['treatment_id'] ?? '';
        $this->piece = $args['piece'] ?? '';
        $this->unit_price = $args['unit_price'] ?? 0;
        $this->discount = $args['discount'] ?? 0;
        $this->total_price = $args['total_price'] ?? 0;

        $this->selectedPieces = $args['selected_pieces'] ?? [];
        $this->selectedGroup = $args['selected_group'] ?? [];
    }

    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }

    public function getBudgetId(): string {
        return $this->budget_id;
    }

    public function setBudgetId(string $budget_id): void {
        $this->budget_id = $budget_id;
    }

    public function getTreatmentId(): string {
        return $this->treatment_id;
    }

    public function setTreatmentId(string $treatment_id): void {
        $this->treatment_id = $treatment_id;
    }

    public function getPiece(): string {
        return $this->piece;
    }

    public function setPiece(string $piece): void {
        $this->piece = $piece;
    }
    
    public function getUnitPrice(): float {
        return $this->unit_price;
    }

    public function setUnitPrice(float $unit_price): void {
        $this->unit_price = $unit_price;
    }

    public function getDiscount(): int {
        return $this->discount;
    }

    public function setDiscount(int $discount): void {
        $this->discount = $discount;
    }

    public function getTotalPrice(): float {
        return $this->total_price;
    }

    public function setTotalPrice(float $total_price): void {
        $this->total_price = $total_price;
    }

    public function getSelectedPieces(): array {
        return $this->selected_pieces;
    }

    public function setSelectedPieces(array $selected_pieces): void {
        $this->selected_pieces = $selected_pieces;
    }

    public function getSelectedGroup(): array {
        return $this->selected_group;
    }

    public function setSelectedGroup(array $selected_group): void {
        $this->selected_group = $selected_group;
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
        if (empty($this->treatment_id)) {
            $this->errors['treatment'] = 'El tratamiento no puede estar vacío';
        }
        if (empty($this->unit_price)) {
            $this->errors['price'] = 'El precio no puede estar vacío';
        }
        return $this->errors;
    }

    public function calculateTotalPrice(): string {
        return $this->unit_price - $this->unit_price * $this->discount / 100 ?? 0;
    }
}
