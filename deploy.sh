#!/bin/sh
LOG=/home/desa7677/deploy-debug.log

echo "=== DEPLOY START ===" > "$LOG"
date >> "$LOG" 2>&1

echo "--- mkdir ---" >> "$LOG"
mkdir -p /home/desa7677/laravel-app >> "$LOG" 2>&1
echo "exit: $?" >> "$LOG"

echo "--- cp single file test ---" >> "$LOG"
cp /home/desa7677/repositories/laravel-app/artisan /home/desa7677/laravel-app/artisan >> "$LOG" 2>&1
echo "exit: $?" >> "$LOG"

echo "--- cp full repo ---" >> "$LOG"
date >> "$LOG" 2>&1
cp -a /home/desa7677/repositories/laravel-app/. /home/desa7677/laravel-app/ >> "$LOG" 2>&1
echo "cp exit: $?" >> "$LOG"
date >> "$LOG" 2>&1

echo "--- rm .git ---" >> "$LOG"
rm -rf /home/desa7677/laravel-app/.git >> "$LOG" 2>&1

echo "--- ls laravel-app ---" >> "$LOG"
ls /home/desa7677/laravel-app/ >> "$LOG" 2>&1

echo "--- which php ---" >> "$LOG"
which php >> "$LOG" 2>&1 || echo "php not in PATH" >> "$LOG"
ls /opt/alt/php84/usr/bin/php >> "$LOG" 2>&1 || echo "php84 alt not found" >> "$LOG"
ls /opt/cpanel/ea-php84/root/usr/bin/php >> "$LOG" 2>&1 || echo "ea-php84 not found" >> "$LOG"
ls /usr/local/bin/php >> "$LOG" 2>&1 || echo "php local not found" >> "$LOG"
ls /usr/local/bin/ea-php84 >> "$LOG" 2>&1 || echo "ea-php84 bin not found" >> "$LOG"
find /opt -name "php" -type f 2>/dev/null | head -5 >> "$LOG" 2>&1 || echo "no php in /opt" >> "$LOG"

echo "=== DEPLOY END ===" >> "$LOG"
