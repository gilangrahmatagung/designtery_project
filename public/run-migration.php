<?php

/**
 * Migration Runner Script
 *
 * DELETE THIS FILE AFTER USE.
 * Access via: https://yourdomain.com/run-migration.php
 *
 * This script:
 * 1. Runs all pending migrations
 * 2. Clears config, route, and cache
 * 3. Verifies tables exist
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

header('Content-Type: text/plain; charset=utf-8');
echo "=== Designtery Migration Runner ===\n\n";

// 1. Test DB connection first
echo "1. TESTING DATABASE CONNECTION\n";
echo str_repeat('-', 40)."\n";
try {
    $pdo = $app->make('db')->connection()->getPdo();
    echo "  Status:     CONNECTED OK\n";
    echo "  Database:   ".$app->make('db')->connection()->getConfig('database')."\n";
} catch (Exception $e) {
    echo "  Status:     FAILED\n";
    echo "  Error:      ".$e->getMessage()."\n";
    echo "\n  Cannot run migrations without a database connection.\n";
    echo "  Fix your .env DB settings first.\n";
    exit(1);
}

// 2. Run migrations
echo "\n2. RUNNING MIGRATIONS\n";
echo str_repeat('-', 40)."\n";
try {
    $status = $kernel->call('migrate', ['--force' => true]);
    echo "  Result:     Migration completed (exit: {$status})\n";
} catch (Exception $e) {
    echo "  Error:      ".$e->getMessage()."\n";
    exit(1);
}

// 3. Clear caches
echo "\n3. CLEARING CACHES\n";
echo str_repeat('-', 40)."\n";
$caches = ['config:clear', 'route:clear', 'view:clear', 'cache:clear'];
foreach ($caches as $cache) {
    try {
        $kernel->call($cache);
        echo "  OK  {$cache}\n";
    } catch (Exception $e) {
        echo "  FAIL {$cache}: ".$e->getMessage()."\n";
    }
}

// 4. Verify tables
echo "\n4. VERIFYING TABLES\n";
echo str_repeat('-', 40)."\n";
$requiredTables = ['users', 'posts', 'categories', 'sessions', 'cache', 'cache_locks', 'migrations', 'password_reset_tokens', 'jobs', 'job_batches', 'failed_jobs'];
$existingTables = $app->make('db')->getDoctrineSchemaManager()->listTableNames();

foreach ($requiredTables as $table) {
    $exists = in_array($table, $existingTables);
    echo ($exists ? "  OK" : "  MISSING")."  {$table}\n";
}

$missing = array_diff($requiredTables, $existingTables);
if (! empty($missing)) {
    echo "\n  WARNING: Some tables are still missing!\n";
    echo "  Missing: ".implode(', ', $missing)."\n";
}

// 5. Row counts
echo "\n5. TABLE ROW COUNTS\n";
echo str_repeat('-', 40)."\n";
$db = $app->make('db');
foreach (['users', 'posts', 'categories'] as $table) {
    if (in_array($table, $existingTables)) {
        $count = $db->table($table)->count();
        echo "  {$table}: {$count} rows\n";
    }
}

// 6. Storage permissions check
echo "\n6. STORAGE PERMISSIONS\n";
echo str_repeat('-', 40)."\n";
$storageDirs = [
    $basePath.'/storage/framework/sessions' => 'storage/framework/sessions/',
    $basePath.'/storage/framework/cache' => 'storage/framework/cache/',
    $basePath.'/storage/logs' => 'storage/logs/',
    $basePath.'/bootstrap/cache' => 'bootstrap/cache/',
];

foreach ($storageDirs as $dir => $label) {
    $writable = is_dir($dir) && is_writable($dir);
    echo ($writable ? "  OK" : "  NOT WRITABLE")."  {$label}\n";
}

$elapsed = round((microtime(true) - $startTime) * 1000);
echo "\n=== Done in {$elapsed}ms ===\n";
echo "\n!! DELETE THIS FILE AFTER USE !!\n";
