<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/scripts/helpers.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
