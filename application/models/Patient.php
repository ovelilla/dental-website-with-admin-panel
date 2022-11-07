<?php

namespace Models;

class Patient {
    private string $table = 'patients';
    private array $columns = ['id', 'name', 'surname', 'phone', 'email', 'nif', 'birth_date', 'gender', 'meet', 'insurance', 'address', 'postcode', 'location', 'province', 'country', 'reason', 'medication', 'allergies', 'diseases', 'smoker', 'infectious', 'comment', 'active', 'created_at'];

    private ?int $id;
    private string $name;
    private string $surname;
    private string $phone;
    private string $email;
    private string $nif;
    private ?string $birth_date;
    private string $gender;
    private string $meet;
    private string $insurance;
    private string $address;
    private string $postcode;
    private string $location;
    private string $province;
    private string $country;
    private string $reason;
    private string $medication;
    private string $allergies;
    private string $diseases;
    private string $smoker;
    private string $infectious;
    private string $comment;
    private int $active;
    private string $created_at;

    private array $errors = [];

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->surname = $args['surname'] ?? '';
        $this->phone = $args['phone'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->nif = $args['nif'] ?? '';
        $this->birth_date = $args['birth_date'] ?? '';
        $this->gender = $args['gender'] ?? '';
        $this->meet = $args['meet'] ?? '';
        $this->insurance = $args['insurance'] ?? '';
        $this->address = $args['address'] ?? '';
        $this->postcode = $args['postcode'] ?? '';
        $this->location = $args['location'] ?? '';
        $this->province = $args['province'] ?? '';
        $this->country = $args['country'] ?? '';
        $this->reason = $args['reason'] ?? '';
        $this->medication = $args['medication'] ?? '';
        $this->allergies = $args['allergies'] ?? '';
        $this->diseases = $args['diseases'] ?? '';
        $this->smoker = $args['smoker'] ?? '';
        $this->infectious = $args['infectious'] ?? '';
        $this->comment = $args['comment'] ?? '';
        $this->active = $args['active'] ?? 1;
        $this->created_at = $args['created_at'] ?? '';
    }

    public function getId(): ?int {
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

    public function getPhone(): string {
        return $this->phone;
    }

    public function setPhone(string $phone): void {
        $this->phone = $phone;
    }

    public function getEmail(): string {
        return $this->email;
    }

    public function setEmail(string $email): void {
        $this->email = $email;
    }

    public function getNif(): string {
        return $this->nif;
    }

    public function setNif(string $nif): void {
        $this->nif = $nif;
    }

    public function getBirthDate(): ?string {
        return $this->birth_date;
    }

    public function setBirthDate(?string $birth_date): void {
        $this->birth_date = $birth_date;
    }

    public function getGender(): string {
        return $this->gender;
    }

    public function setGender(string $gender): void {
        $this->gender = $gender;
    }

    public function getMeet(): string {
        return $this->meet;
    }

    public function setMeet(string $meet): void {
        $this->meet = $meet;
    }

    public function getInsurance(): string {
        return $this->insurance;
    }

    public function setInsurance(string $insurance): void {
        $this->insurance = $insurance;
    }

    public function getAddress(): string {
        return $this->address;
    }

    public function setAddress(string $address): void {
        $this->address = $address;
    }

    public function getPostcode(): string {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): void {
        $this->postcode = $postcode;
    }

    public function getLocation(): string {
        return $this->location;
    }

    public function setLocation(string $location): void {
        $this->location = $location;
    }

    public function getProvince(): string {
        return $this->province;
    }

    public function setProvince(string $province): void {
        $this->province = $province;
    }

    public function getCountry(): string {
        return $this->country;
    }

    public function setCountry(string $country): void {
        $this->country = $country;
    }

    public function getReason(): string {
        return $this->reason;
    }

    public function setReason(string $reason): void {
        $this->reason = $reason;
    }

    public function getMedication(): string {
        return $this->medication;
    }

    public function setMedication(string $medication): void {
        $this->medication = $medication;
    }

    public function getAllergies(): string {
        return $this->allergies;
    }

    public function setAllergies(string $allergies): void {
        $this->allergies = $allergies;
    }

    public function getDiseases(): string {
        return $this->diseases;
    }

    public function setDiseases(string $diseases): void {
        $this->diseases = $diseases;
    }

    public function getSmoker(): string {
        return $this->smoker;
    }

    public function setSmoker(string $smoker): void {
        $this->smoker = $smoker;
    }

    public function getInfectious(): string {
        return $this->infectious;
    }

    public function setInfectious(string $infectious): void {
        $this->infectious = $infectious;
    }

    public function getComment(): string {
        return $this->comment;
    }

    public function setComment(string $comment): void {
        $this->comment = $comment;
    }

    public function getActive(): int {
        return $this->active;
    }

    public function setActive(int $active): void {
        $this->active = $active;
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
        if (empty($this->name)) {
            $this->errors['name'] = 'El nombre no puede estar vacío';
        }
        if ($this->email && !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $this->errors['email'] = 'El email no es válido';
        }
        return $this->errors;
    }

    public function calculateAge(?string $birth_date): string {
        if (empty($birth_date)) {
            return '';
        } else {
            $current_date = date('Y-m-d');
            $age = date_diff(date_create($birth_date), date_create($current_date));
            return $age->y;
        }
    }
}
