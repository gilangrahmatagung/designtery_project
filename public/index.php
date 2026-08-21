<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine Laravel base path (supports both laravel-app/public and public_html deployments)
$laravelBase = __DIR__.'/..';
if (file_exists(__DIR__.'/../laravel-app/vendor/autoload.php')) {
    $laravelBase = __DIR__.'/../laravel-app';
} elseif (! file_exists(__DIR__.'/../vendor/autoload.php') && file_exists(__DIR__.'/../../laravel-app/vendor/autoload.php')) {
    $laravelBase = __DIR__.'/../../laravel-app';
}

// Determine if the application is in maintenance mode...
$maintenanceCandidates = [
    $laravelBase.'/storage/framework/maintenance.php',
    __DIR__.'/../storage/framework/maintenance.php',
    __DIR__.'/../laravel-app/storage/framework/maintenance.php',
];
foreach ($maintenanceCandidates as $candidate) {
    if (file_exists($candidate)) {
        require $candidate;
        break;
    }
}

// Register the Composer autoloader...
$autoload = $laravelBase.'/vendor/autoload.php';
if (! file_exists($autoload)) {
    $autoload = __DIR__.'/../vendor/autoload.php';
}
require $autoload;

// Bootstrap Laravel and handle the request...
$bootstrap = $laravelBase.'/bootstrap/app.php';
if (! file_exists($bootstrap)) {
    $bootstrap = __DIR__.'/../bootstrap/app.php';
}
/** @var Application $app */
$app = require_once $bootstrap;

$app->handleRequest(Request::capture());
