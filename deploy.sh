#!/bin/sh
set -e

REPO=/home/desa7677/repositories/laravel-app
APP=/home/desa7677/laravel-app
PUBLIC=/home/desa7677/public_html
PHP=/opt/alt/php84/usr/bin/php

# 1. Backup .env dan storage data
cp "$APP/.env" /home/desa7677/.env.deploy.bak 2>/dev/null || true
cp -a "$APP/storage/app" /home/desa7677/.storage-app.bak 2>/dev/null || true
cp -a "$APP/storage/logs" /home/desa7677/.storage-logs.bak 2>/dev/null || true
cp -a "$APP/storage/framework/sessions" /home/desa7677/.storage-sessions.bak 2>/dev/null || true

# 2. Clean dan copy fresh dari repo
rm -rf "$APP.old" 2>/dev/null || true
mv "$APP" "$APP.old" 2>/dev/null || true
mkdir -p "$APP"
cp -a "$REPO/." "$APP/"
rm -rf "$APP/.git"

# 3. Restore .env (production)
cp /home/desa7677/.env.deploy.bak "$APP/.env" 2>/dev/null || true

# 4. Restore storage data
cp -a /home/desa7677/.storage-app.bak/. "$APP/storage/app/" 2>/dev/null || true
cp -a /home/desa7677/.storage-logs.bak/. "$APP/storage/logs/" 2>/dev/null || true
mkdir -p "$APP/storage/framework/sessions"
cp -a /home/desa7677/.storage-sessions.bak/. "$APP/storage/framework/sessions/" 2>/dev/null || true

# 5. Cleanup backups
rm -f /home/desa7677/.env.deploy.bak 2>/dev/null || true
rm -rf /home/desa7677/.storage-app.bak /home/desa7677/.storage-logs.bak /home/desa7677/.storage-sessions.bak 2>/dev/null || true
rm -rf "$APP.old" 2>/dev/null || true

# 6. Copy public ke public_html
cp -a "$APP/public/." "$PUBLIC/"
cp -a "$APP/public/.htaccess" "$PUBLIC/" 2>/dev/null || true

# 7. Patch index.php (public_html terpisah dari laravel-app)
sed -i "s|__DIR__.'/../vendor|__DIR__.'/../laravel-app/vendor|g" "$PUBLIC/index.php" 2>/dev/null || true
sed -i "s|__DIR__.'/../bootstrap|__DIR__.'/../laravel-app/bootstrap|g" "$PUBLIC/index.php" 2>/dev/null || true
sed -i "s|__DIR__.'/../storage|__DIR__.'/../laravel-app/storage|g" "$PUBLIC/index.php" 2>/dev/null || true

# 8. Artisan commands
cd "$APP"
$PHP artisan storage:link 2>/dev/null || true
$PHP artisan config:clear 2>/dev/null || true
$PHP artisan route:clear 2>/dev/null || true
$PHP artisan view:clear 2>/dev/null || true
$PHP artisan config:cache 2>/dev/null || true
$PHP artisan route:cache 2>/dev/null || true
$PHP artisan view:cache 2>/dev/null || true
$PHP artisan migrate --force 2>/dev/null || true
