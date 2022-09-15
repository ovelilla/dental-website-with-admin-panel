<?php

require '../vendor/autoload.php';
require 'scripts/helpers.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
