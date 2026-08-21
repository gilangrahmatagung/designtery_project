<?php

/**
 * Database Connection Test Script
 *
 * DELETE THIS FILE AFTER USE.
 * Access via: https://yourdomain.com/test-db.php
 */

$startTime = microtime(true);

// Detect cPanel layout (../laravel-app/) vs local (../)
$basePath = file_exists(__DIR__.'/../laravel-app/vendor/autoload.php')
    ? __DIR__.'/../laravel-app'
    : __DIR__.'/..';

// Register the Composer autoloader
require $basePath.'/vendor/autoload.php';

// Bootstrap Laravel
$app = require_once $basePath.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Disable maintenance mode check for this script
$app->useStoragePath($basePath.'/storage');

header('Content-Type: text/plain; charset=utf-8');
echo "=== Designtery DB Connection Test ===\n\n";

// 1. Test basic DB connection
echo "1. DATABASE CONNECTION\n";
echo str_repeat('-', 40)."\n";
try {
    $db = $app->make('db');
    $connection = $db->connection();
    $pdo = $connection->getPdo();

    echo "Status:        CONNECTED OK\n";
    echo "Driver:        ".$connection->getConfig('driver')."\n";
    echo "Host:          ".$connection->getConfig('host')."\n";
    echo "Port:          ".$connection->getConfig('port')."\n";
    echo "Database:      ".$connection->getConfig('database')."\n";
    echo "Username:      ".$connection->getConfig('username')."\n";
    echo "PHP PDO:       ".phpversion('pdo_mysql')."\n";
    echo "MySQL Server:  ".$pdo->query('SELECT VERSION()')->fetchColumn()."\n";
} catch (Exception $e) {
    echo "Status:        FAILED\n";
    echo "Error:         ".$e->getMessage()."\n";
    echo "\nFIX: Check DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD in .env\n";
    exit(1);
}

// 2. Check required tables
echo "\n2. REQUIRED TABLES\n";
echo str_repeat('-', 40)."\n";
$requiredTables = ['users', 'posts', 'categories', 'sessions', 'cache', 'cache_locks', 'migrations', 'password_reset_tokens', 'jobs', 'job_batches', 'failed_jobs'];
$existingTables = $connection->getDoctrineSchemaManager()->listTableNames();

foreach ($requiredTables as $table) {
    $exists = in_array($table, $existingTables);
    echo ($exists ? "  OK" : "  MISSING")."  {$table}\n";
}

$missing = array_diff($requiredTables, $existingTables);
if (! empty($missing)) {
    echo "\nMissing tables detected! Run run-migration.php to create them.\n";
}

// 3. Count rows in key tables
echo "\n3. TABLE ROW COUNTS\n";
echo str_repeat('-', 40)."\n";
foreach (['users', 'posts', 'categories', 'sessions'] as $table) {
    if (in_array($table, $existingTables)) {
        $count = $connection->table($table)->count();
        echo "  {$table}: {$count} rows\n";
    }
}

// 4. Test write capability (insert + delete a test row in cache)
echo "\n4. WRITE TEST\n";
echo str_repeat('-', 40)."\n";
try {
    $testKey = '__db_test_'.time();
    $connection->table('cache')->insert([
        'key' => $testKey,
        'value' => 'test',
        'expiration' => time() + 60,
    ]);
    $connection->table('cache')->where('key', $testKey)->delete();
    echo "  Status: OK (cache table is writable)\n";
} catch (Exception $e) {
    echo "  Status: FAILED - ".$e->getMessage()."\n";
    echo "  FIX: Ensure the 'cache' table exists and is writable.\n";
}

// 5. Check storage permissions
echo "\n5. STORAGE PERMISSIONS\n";
echo str_repeat('-', 40)."\n";
$storageDirs = [
    $basePath.'/storage' => 'storage/',
    $basePath.'/storage/framework' => 'storage/framework/',
    $basePath.'/storage/framework/sessions' => 'storage/framework/sessions/',
    $basePath.'/storage/framework/cache' => 'storage/framework/cache/',
    $basePath.'/storage/logs' => 'storage/logs/',
    $basePath.'/bootstrap/cache' => 'bootstrap/cache/',
];

foreach ($storageDirs as $dir => $label) {
    $writable = is_dir($dir) && is_writable($dir);
    echo ($writable ? "  OK" : "  NOT WRITABLE")."  {$label}\n";
    if (! is_dir($dir)) {
        echo "        -> Directory does not exist\n";
    }
}

// 6. Check .env config
echo "\n6. KEY ENV SETTINGS\n";
echo str_repeat('-', 40)."\n";
echo "  DB_CONNECTION:      ".config('database.default')."\n";
echo "  SESSION_DRIVER:     ".config('session.driver')."\n";
echo "  CACHE_STORE:        ".config('cache.default')."\n";
echo "  QUEUE_CONNECTION:   ".config('queue.default')."\n";
echo "  APP_DEBUG:          ".(config('app.debug') ? 'true' : 'false')."\n";
echo "  APP_URL:            ".config('app.url')."\n";

echo "\n=== Test Complete ===\n";
echo "\n!! DELETE THIS FILE AFTER USE !!\n";
