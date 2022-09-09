<?php

namespace Models;

use mysqli;
use Exception;

class Database {
    private string $db_host;
    private string $db_user;
    private string $db_pass;
    private string $db_name;

    private object $connection;

    private string $query = '';
    private string $types = '';
    private array $values = [];

    protected array $errors = [];

    public function __construct() {
        $this->db_host = $_ENV['DB_HOST'];
        $this->db_user = $_ENV['DB_USER'];
        $this->db_pass = $_ENV['DB_PASS'];
        $this->db_name = $_ENV['DB_NAME'];
    }

    protected function connect(): void {
        try {
            $this->connection = new mysqli($this->db_host, $this->db_user, $this->db_pass, $this->db_name);
        } catch (Exception | Error $e) {
            throw new Exception($e->getMessage());
        }
    }

    protected function disconnect(): void {
        $this->connection->close();
    }

    public function select(): Database {
        $args = func_get_args();

        if (empty($args)) {
            $columns = '*';
        } else {
            $columns = $this->escape($args);
        }

        $this->query .= "SELECT $columns FROM " . $this->escape([$this->table]);

        return $this;
    }

    public function join(string $table, string $column1, string $column2): Database {
        $column1 = $this->escape([$column1]);
        $column2 = $this->escape([$column2]);

        $this->query .= " INNER JOIN `$table` ON $column1 = $column2";

        return $this;
    }

    public function where(string $column, string $operator, string $value): Database {
        $column = $this->escape([$column]);

        $this->types .= "s";
        $this->values[] = $value;

        $this->query .= " WHERE $column $operator ?";

        return $this;
    }

    public function andWhere(string $column, string $operator, string $value): Database {
        $column = $this->escape([$column]);

        $this->types .= "s";
        $this->values[] = $value;
        
        $this->query .= " AND $column $operator ?";
        
        return $this;
    }

    public function orWhere(string $column, string $operator, string $value): Database {
        $column = $this->escape([$column]);

        $this->types .= "s";
        $this->values[] = $value;
        
        $this->query .= " OR $column $operator ?";
        
        return $this;
    }

    public function whereIn(string $column, array $values): Database {
        $column = $this->escape([$column]);
        $parameters = str_repeat('?,', count($values) - 1) . '?';

        $this->types .= str_repeat('s', count($values));
        $this->values = array_merge($this->values, $values);
        
        $this->query .= " WHERE $column IN ($parameters)";
        
        return $this;
    }

    public function orderBy(string $column, string $direction): Database {
        $column = $this->escape([$column]);

        $this->query .= " ORDER BY $column $direction";

        return $this;
    }

    public function groupBY(string $column): Database {
        $column = $this->escape([$column]);

        $this->query .= " GROUP BY $column";

        return $this;
    }

    public function limit(int $limit): Database {
        $this->query .= " LIMIT $limit";

        return $this;
    }

    public function offset(int $offset): Database {
        $this->query .= " OFFSET $offset";

        return $this;
    }

    public function paginate(int $page, int $perPage): Database {
        $this->limit($perPage);
        $this->offset(($page - 1) * $perPage);

        return $this;
    }

    public function count(): Database {
        $this->query = "SELECT COUNT(*) FROM " . $this->escape([$this->table]);
        return $this;
    }

    public function get(): array {
        $this->connect();

        $stmt = $this->connection->prepare($this->query);
        if ($this->values) {
            $stmt->bind_param($this->types, ...$this->values);
        }
        $stmt->execute();

        $result = $stmt->get_result();
        $rows = $result->num_rows;
        $result = $this->fetch($result, $rows);

        $stmt->close();
        $this->disconnect();

        $this->query = '';
        $this->types = '';
        $this->values = [];

        return $result;
    }

    protected function fetch(object $result, int $rows): array {
        if ($rows > 1) {
            $result = $this->fetchAll($result);
        } else {
            $result = $this->fetchOne($result);
        }
        return $result;
    }

    private function fetchOne(object $result): array {
        return $result->fetch_assoc() ?? [];
    }

    private function fetchAll(object $result): array {
        while ($row = $result->fetch_assoc()) {
            $array[] = $row;
        }
        return $array ?? [];
    }

    public function save(): ?array {
        if (is_null($this->id)) {
            $result = $this->insert();
        } else {
            $result = $this->update();
        }
        return $result;
    }

    public function insert(): array {
        $this->connect();

        $data = $this->getData();

        $columns = array_keys($data);
        $columns = $this->escape($columns);

        $values = array_values($data);

        $parameters = str_repeat('?,', count($values) - 1) . '?';
        $types = str_repeat('s', count($values));

        $query = "INSERT INTO " . $this->table . " ($columns) VALUES ($parameters)";

        $stmt = $this->connection->prepare($query);
        $stmt->bind_param($types, ...$values);
        $stmt->execute();

        $insert_id = $stmt->insert_id;
        $affected_rows = $stmt->affected_rows;

        $stmt->close();
        $this->disconnect();

        $this->query = '';
        $this->types = '';
        $this->values = [];

        return [
            'insert_id' => $insert_id,
            'affected_rows' => $affected_rows
        ];
    }

    public function update(): array {
        $this->connect();

        $data = $this->getData();

        $columns = array_keys($data);

        $values = array_values($data);
        $values[] = $this->id;

        $types = str_repeat('s', count($values));

        $query = "UPDATE " . $this->table . " SET ";
        foreach ($columns as $i => $column) {
            $query .= $i ? ', ' : '';
            $query .= $this->escape([$column]) . " = ?";
        }

        $query .= " WHERE id = ?";

        $stmt = $this->connection->prepare($query);
        $stmt->bind_param($types, ...$values);
        $stmt->execute();

        $affected_rows = $stmt->affected_rows;

        $stmt->close();
        $this->disconnect();

        $this->query = '';
        $this->types = '';
        $this->values = [];

        return [
            'affected_rows' => $affected_rows
        ];
    }

    public function delete(array $conditions): array {
        $this->connect();

        $columns = array_keys($conditions);
        $values = array_values($conditions);
        $types = str_repeat('s', count($values));

        $query = "DELETE FROM " . $this->table . " WHERE ";

        foreach ($columns as $i => $column) {
            $query .= $i ? ' AND ' : '';
            $query .= "$column = ?";
        }

        $stmt = $this->connection->prepare($query);
        $stmt->bind_param($types, ...$values);
        $stmt->execute();

        $affected_rows = $stmt->affected_rows;

        $stmt->close();
        $this->disconnect();

        $this->query = '';
        $this->types = '';
        $this->values = [];

        return [
            'affected_rows' => $affected_rows
        ];
    }

    public function sql($query) {
        $this->connect();

        $stmt = $this->connection->prepare($query);
        $stmt->execute();

        $result = $stmt->get_result();
        $result = $this->fetch($result, $result->num_rows === 1);

        $stmt->close();
        $this->disconnect();

        return $result;
    }

    public function sync($args = []) {
        foreach ($args as $key => $value) {
            if (property_exists($this, $key) && !is_null($value)) {
                $this->$key = $value;
            }
        }
    }

    public function getData(): array {
        $data = [];
        foreach ($this->columns as $column) {
            if ($column === 'id') continue;
            $data[$column] = $this->$column;
        }
        return $data;
    }

    protected function escape($columns) {
        return implode(', ', array_map(fn ($column) => implode(' AS ', array_map(fn ($column) => implode('.', array_map(fn ($column) => $column === '*' ? $column : "`" . str_replace("`", "``", $column) . "`", explode('.', $column))), explode(' AS ', $column))), $columns));
    }

    public function setError($type, $message): void {
        $this->errors[$type] = $message;
    }

    public function getErrors(): array {
        return $this->errors;
    }

    public function getQuery(): string {
        return $this->query;
    }
}
