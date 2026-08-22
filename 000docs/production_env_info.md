# Production Environment & Deployment

## Server Environment

- **Hosting**: PHP Web Hosting (shared hosting)
- **Control Panel**: cPanel
- **PHP**: 8.4 (path: `/opt/alt/php84/usr/bin/php`, juga tersedia di `/usr/local/bin/php`)
- **No NodeJS** di server (build dilakukan di GitHub Actions)
- **No SSH/terminal access** (semua operasi server via cPanel GUI atau `.cpanel.yml`)
- **No rsync** terinstall di server (gunakan `cp -a` sebagai pengganti)
- **cPanel user**: `desa7677`

## Struktur Folder Server

```
/home/desa7677/
├── repositories/laravel-app/   ← cPanel Git clone (auto-managed, JANGAN edit manual)
├── laravel-app/                ← Aplikasi Laravel yang berjalan
│   ├── .env                    ← Konfigurasi production (DIPERTAHANKAN saat deploy)
│   ├── vendor/                 ← Dependencies PHP (dari GitHub Actions build)
│   ├── public/build/           ← Frontend assets (dari GitHub Actions build)
│   ├── storage/app/            ← File upload user (DIPERTAHANKAN saat deploy)
│   ├── storage/logs/           ← Log aplikasi (DIPERTAHANKAN saat deploy)
│   └── ...
├── public_html/                ← Document root web server
│   ├── index.php               ← Entry point (path di-patch ke ../laravel-app/)
│   ├── build/                  ← Frontend assets (copy dari laravel-app/public/)
│   └── .htaccess
└── deploy-debug.log            ← Log debug deployment (bisa dihapus)
```

> **Catatan**: `public_html/index.php` di-patch otomatis saat deploy agar `__DIR__.'/../vendor'`
> menjadi `__DIR__.'/../laravel-app/vendor'` (juga `bootstrap` dan `storage`),
> karena `public_html` terpisah dari `laravel-app`.

## CI/CD Pipeline

### Flow Deployment

```
Push ke main → GitHub Actions build → Push ke branch deploy → cPanel pull & deploy
```

1. **Developer push ke branch `main`**
2. **GitHub Actions** (`.github/workflows/deploy_v3.yml`):
   - Install PHP 8.4 + Composer dependencies (`--no-dev`)
   - Install Node 20 + `npm run build`
   - Hapus `node_modules`
   - Push semua file (termasuk `vendor/` dan `public/build/`) ke **branch `deploy`** dengan `git add -A -f`
3. **cPanel Git Version Control**:
   - Repository path: `/home/desa7677/repositories/laravel-app`
   - Branch: `deploy`
   - Klik **Update** untuk pull, lalu **Deploy HEAD Commit**
4. **cPanel menjalankan** `.cpanel.yml` → memanggil `deploy.sh`

### File Deployment

| File | Fungsi |
|------|--------|
| `.github/workflows/deploy_v3.yml` | GitHub Actions: build + push ke branch `deploy` |
| `.cpanel.yml` | Entry point cPanel deploy, memanggil `deploy.sh` |
| `deploy.sh` | Script deployment utama yang dijalankan di server |

### Apa yang dilakukan `deploy.sh`

1. **Backup** `.env`, `storage/app`, `storage/logs`, `storage/framework/sessions`
2. **Replace** `laravel-app/` dengan fresh copy dari `repositories/laravel-app/`
3. **Hapus** `.git` dari target (hemat space)
4. **Restore** `.env` dan storage data dari backup
5. **Copy** `public/` ke `public_html/`
6. **Patch** `index.php` path references
7. **Artisan**: `storage:link`, clear + cache config/route/view, `migrate --force`

## Catatan Penting

- **`.env` production** dikelola manual via File Manager cPanel. TIDAK ada di Git.
- **Branch `deploy`** adalah orphan branch, JANGAN merge ke `main` atau sebaliknya.
- **cPanel YAML parser** bermasalah dengan banyak task — itulah kenapa semua logic ada di `deploy.sh`, bukan di `.cpanel.yml`.
- **Setiap push ke `main`** otomatis trigger build. Untuk deploy ke production, tetap perlu manual klik Update + Deploy di cPanel.
