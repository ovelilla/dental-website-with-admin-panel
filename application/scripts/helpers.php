<?php

function debug($variable): string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

function getCurrentPage(): string {
    return basename($_SERVER['PHP_SELF']);
}

function randomId($length): string {
    return bin2hex(random_bytes($length));
}

function isAuth(): void {
    if (!isset($_SESSION['login'])) {
        header('Location: /');
    }
}

function slugify($text, string $divider = '-'): string {
    $text = preg_replace('~[^\pL\d]+~u', $divider, $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, $divider);
    $text = preg_replace('~-+~', $divider, $text);
    $text = strtolower($text);

    if (empty($text)) {
        return 'n-a';
    }

    return $text;
}
