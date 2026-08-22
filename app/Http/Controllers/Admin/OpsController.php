<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OpsController extends Controller
{
    /**
     * Display system status and ops dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('admin/ops/index', [
            'system' => $this->getSystemStatus(),
            'recentLogs' => $this->getRecentLogs(),
            'lastCommand' => $request->session()->get('last_command'),
        ]);
    }

    /**
     * Run a whitelisted ops / maintenance command.
     */
    public function run(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'action' => [
                'required',
                'string',
                'in:optimize-clear,optimize-cache,migrate,storage-link,config-clear,route-clear,view-clear,cache-clear,clear-logs',
            ],
        ]);

        $action = $validated['action'];
        $output = '';
        $isSuccess = true;

        try {
            switch ($action) {
                case 'optimize-clear':
                    Artisan::call('optimize:clear');
                    $output = Artisan::output();
                    $message = 'All caches cleared successfully. Environment configuration reloaded.';
                    break;

                case 'optimize-cache':
                    Artisan::call('config:cache');
                    $output .= Artisan::output().PHP_EOL;
                    Artisan::call('route:cache');
                    $output .= Artisan::output().PHP_EOL;
                    Artisan::call('view:cache');
                    $output .= Artisan::output();
                    $message = 'Production optimization caches built successfully.';
                    break;

                case 'migrate':
                    Artisan::call('migrate', ['--force' => true]);
                    $output = Artisan::output();
                    $message = 'Database migrations executed successfully.';
                    break;

                case 'storage-link':
                    Artisan::call('storage:link');
                    $output = Artisan::output();
                    $message = 'Storage symbolic link created/verified.';
                    break;

                case 'config-clear':
                    Artisan::call('config:clear');
                    $output = Artisan::output();
                    $message = 'Configuration cache cleared.';
                    break;

                case 'route-clear':
                    Artisan::call('route:clear');
                    $output = Artisan::output();
                    $message = 'Route cache cleared.';
                    break;

                case 'view-clear':
                    Artisan::call('view:clear');
                    $output = Artisan::output();
                    $message = 'Compiled views cleared.';
                    break;

                case 'cache-clear':
                    Artisan::call('cache:clear');
                    $output = Artisan::output();
                    $message = 'Application cache cleared.';
                    break;

                case 'clear-logs':
                    $logFile = storage_path('logs/laravel.log');
                    if (File::exists($logFile)) {
                        File::put($logFile, '');
                    }
                    $output = 'laravel.log has been truncated.';
                    $message = 'Application log file cleared.';
                    break;

                default:
                    $isSuccess = false;
                    $output = 'Unknown operation requested.';
                    $message = 'Invalid operation requested.';
                    break;
            }
        } catch (Throwable $e) {
            $isSuccess = false;
            $output = $e->getMessage().PHP_EOL.$e->getTraceAsString();
            $message = 'Failed to execute command: '.$e->getMessage();
        }

        $request->session()->flash('last_command', [
            'action' => $action,
            'status' => $isSuccess ? 'success' : 'error',
            'output' => trim($output),
            'timestamp' => now()->toDateTimeString(),
        ]);

        Inertia::flash('toast', [
            'type' => $isSuccess ? 'success' : 'error',
            'message' => $message,
        ]);

        return to_route('admin.ops.index');
    }

    /**
     * Get system details and cache flags.
     *
     * @return array{
     *     php_version: string,
     *     laravel_version: string,
     *     app_env: string,
     *     app_debug: bool,
     *     config_cached: bool,
     *     routes_cached: bool,
     *     events_cached: bool,
     *     storage_linked: bool,
     *     db_driver: string,
     *     db_database: string,
     *     db_connected: bool
     * }
     */
    private function getSystemStatus(): array
    {
        $dbConnected = false;
        try {
            DB::connection()->getPdo();
            $dbConnected = true;
        } catch (Throwable) {
            $dbConnected = false;
        }

        $storagePath = public_path('storage');
        $storageLinked = is_link($storagePath) || file_exists($storagePath);

        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'app_env' => (string) config('app.env', 'production'),
            'app_debug' => (bool) config('app.debug', false),
            'config_cached' => app()->configurationIsCached(),
            'routes_cached' => app()->routesAreCached(),
            'events_cached' => app()->eventsAreCached(),
            'storage_linked' => $storageLinked,
            'db_driver' => (string) config('database.default', 'mysql'),
            'db_database' => (string) config('database.connections.'.config('database.default').'.database', ''),
            'db_connected' => $dbConnected,
        ];
    }

    /**
     * Read the tail of the application log file.
     */
    private function getRecentLogs(int $maxLines = 60): string
    {
        $logFile = storage_path('logs/laravel.log');

        if (! File::exists($logFile) || File::size($logFile) === 0) {
            return '';
        }

        $content = File::get($logFile);
        $lines = explode("\n", trim($content));

        if (count($lines) > $maxLines) {
            $lines = array_slice($lines, -$maxLines);
        }

        return implode("\n", $lines);
    }
}
