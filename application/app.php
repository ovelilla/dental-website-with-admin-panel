<?php

require '../vendor/autoload.php';
require 'scripts/helpers.php';

use Dotenv\Dotenv;

if (file_exists(__DIR__ . '/.env')) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
}


// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
// $dotenv->load();
