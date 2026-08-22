import { Head, router, usePage } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    Database,
    FileText,
    HardDrive,
    Layers,
    Link2,
    RefreshCw,
    ShieldAlert,
    Terminal,
    Trash2,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import OpsController from '@/actions/App/Http/Controllers/Admin/OpsController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type SystemStatus = {
    php_version: string;
    laravel_version: string;
    app_env: string;
    app_debug: boolean;
    config_cached: boolean;
    routes_cached: boolean;
    events_cached: boolean;
    storage_linked: boolean;
    db_driver: string;
    db_database: string;
    db_connected: boolean;
};

type LastCommand = {
    action: string;
    status: 'success' | 'error';
    output: string;
    timestamp: string;
};

type PageProps = {
    system: SystemStatus;
    recentLogs: string;
    lastCommand: LastCommand | null;
};

export default function AdminOpsIndex() {
    const { system, recentLogs, lastCommand } = usePage<PageProps>().props;
    const [runningAction, setRunningAction] = useState<string | null>(null);

    const handleRun = (action: string, confirmMessage?: string) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
            return;
        }

        setRunningAction(action);
        router.post(
            OpsController.run.url(),
            { action },
            {
                preserveScroll: true,
                onFinish: () => {
                    setRunningAction(null);
                },
            }
        );
    };

    return (
        <>
            <Head title="System & Ops" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                        System Operations & Maintenance
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Execute Artisan maintenance tasks, clear caches to reload <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs font-mono text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">.env</code>, run database migrations, and monitor server state.
                    </p>
                </div>

                {/* System Status Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <Card className="p-4 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <Activity className="size-4 text-emerald-500" />
                            <span>Environment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold capitalize text-neutral-900 dark:text-neutral-100">
                                {system.app_env}
                            </span>
                            <Badge
                                variant={system.app_env === 'production' ? 'default' : 'secondary'}
                                className="text-[10px] uppercase"
                            >
                                {system.app_env === 'production' ? 'Live' : 'Dev'}
                            </Badge>
                        </div>
                    </Card>

                    <Card className="p-4 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <ShieldAlert className={`size-4 ${system.app_debug ? 'text-amber-500' : 'text-emerald-500'}`} />
                            <span>Debug Mode</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={system.app_debug ? 'destructive' : 'secondary'}
                                className="text-[11px]"
                            >
                                {system.app_debug ? 'Enabled (Warning)' : 'Disabled'}
                            </Badge>
                        </div>
                    </Card>

                    <Card className="p-4 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <Layers className="size-4 text-blue-500" />
                            <span>PHP / Laravel</span>
                        </div>
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            PHP {system.php_version.split('-')[0]} <span className="text-xs text-neutral-500">/ v{system.laravel_version}</span>
                        </div>
                    </Card>

                    <Card className="p-4 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <RefreshCw className="size-4 text-indigo-500" />
                            <span>Config Cache</span>
                        </div>
                        <div>
                            <Badge
                                variant={system.config_cached ? 'default' : 'outline'}
                                className="text-[11px]"
                            >
                                {system.config_cached ? 'Cached (Static)' : 'Dynamic (.env)'}
                            </Badge>
                        </div>
                    </Card>

                    <Card className="p-4 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <Database className={`size-4 ${system.db_connected ? 'text-emerald-500' : 'text-red-500'}`} />
                            <span>Database</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate text-xs font-medium">
                            <span className={`inline-block size-2 rounded-full ${system.db_connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="truncate text-neutral-900 dark:text-neutral-100">
                                {system.db_connected ? system.db_driver : 'Disconnected'}
                            </span>
                        </div>
                    </Card>

                    <Card className="p-4 gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                            <Link2 className={`size-4 ${system.storage_linked ? 'text-emerald-500' : 'text-amber-500'}`} />
                            <span>Storage Link</span>
                        </div>
                        <div>
                            <Badge
                                variant={system.storage_linked ? 'secondary' : 'destructive'}
                                className="text-[11px]"
                            >
                                {system.storage_linked ? 'Linked' : 'Missing'}
                            </Badge>
                        </div>
                    </Card>
                </div>

                {/* Primary Operations */}
                <div>
                    <h2 className="mb-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        Primary Actions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {/* Clear All Caches */}
                        <Card className="flex flex-col justify-between border-blue-200 bg-blue-50/40 dark:border-blue-900/50 dark:bg-blue-950/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                        <Zap className="size-5" />
                                    </div>
                                    <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                                        optimize:clear
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 text-base">
                                    Clear All Caches & Reload .env
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Clears configuration, route, view, event, and application caches. Run this immediately after modifying <code className="font-mono">.env</code> in cPanel.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full"
                                    onClick={() => handleRun('optimize-clear')}
                                    disabled={runningAction !== null}
                                >
                                    <RefreshCw className={`mr-2 size-4 ${runningAction === 'optimize-clear' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'optimize-clear' ? 'Clearing...' : 'Clear All Caches'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Run Migrations */}
                        <Card className="flex flex-col justify-between border-amber-200 bg-amber-50/40 dark:border-amber-900/50 dark:bg-amber-950/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                                        <Database className="size-5" />
                                    </div>
                                    <Badge variant="outline" className="border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-300">
                                        migrate --force
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 text-base">
                                    Run Database Migrations
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Executes any new/pending database migrations in production mode. Safe to execute repeatedly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => handleRun('migrate', 'Are you sure you want to run database migrations on production?')}
                                    disabled={runningAction !== null}
                                >
                                    <Database className={`mr-2 size-4 ${runningAction === 'migrate' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'migrate' ? 'Migrating...' : 'Run Migrations'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Production Optimize Cache */}
                        <Card className="flex flex-col justify-between">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        <HardDrive className="size-5" />
                                    </div>
                                    <Badge variant="outline">
                                        config/route/view:cache
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 text-base">
                                    Build Production Caches
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Caches configuration, routes, and compiled views for fastest production performance.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => handleRun('optimize-cache')}
                                    disabled={runningAction !== null}
                                >
                                    <CheckCircle2 className={`mr-2 size-4 ${runningAction === 'optimize-cache' ? 'animate-spin' : ''}`} />
                                    {runningAction === 'optimize-cache' ? 'Building Cache...' : 'Build Production Cache'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Granular Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Granular Operations</CardTitle>
                        <CardDescription className="text-xs">
                            Run specific Artisan operations individually.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRun('config-clear')}
                            disabled={runningAction !== null}
                        >
                            <RefreshCw className="mr-1.5 size-3.5" />
                            Clear Config Cache
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRun('route-clear')}
                            disabled={runningAction !== null}
                        >
                            <RefreshCw className="mr-1.5 size-3.5" />
                            Clear Route Cache
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRun('view-clear')}
                            disabled={runningAction !== null}
                        >
                            <RefreshCw className="mr-1.5 size-3.5" />
                            Clear View Cache
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRun('cache-clear')}
                            disabled={runningAction !== null}
                        >
                            <RefreshCw className="mr-1.5 size-3.5" />
                            Clear App Cache
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRun('storage-link')}
                            disabled={runningAction !== null}
                        >
                            <Link2 className="mr-1.5 size-3.5" />
                            Link Storage (<code className="text-xs">storage:link</code>)
                        </Button>
                    </CardContent>
                </Card>

                {/* Command Output Terminal */}
                {lastCommand && (
                    <Card className="border-neutral-800 bg-neutral-950 text-neutral-100">
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div className="flex items-center gap-2">
                                <Terminal className="size-4 text-emerald-400" />
                                <CardTitle className="text-sm font-mono text-neutral-200">
                                    Output: {lastCommand.action}
                                </CardTitle>
                                <Badge
                                    variant={lastCommand.status === 'success' ? 'default' : 'destructive'}
                                    className="text-[10px]"
                                >
                                    {lastCommand.status.toUpperCase()}
                                </Badge>
                            </div>
                            <span className="text-xs font-mono text-neutral-400">
                                {lastCommand.timestamp}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <pre className="max-h-60 overflow-y-auto rounded-lg bg-neutral-900 p-4 font-mono text-xs text-neutral-300">
                                {lastCommand.output || '(No console output produced)'}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Application Logs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <FileText className="size-4 text-neutral-500" />
                                <CardTitle className="text-base">Recent Application Logs</CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                                Latest entries from <code className="font-mono">storage/logs/laravel.log</code>
                            </CardDescription>
                        </div>
                        {recentLogs && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/50"
                                onClick={() => handleRun('clear-logs', 'Are you sure you want to clear the application log file?')}
                                disabled={runningAction !== null}
                            >
                                <Trash2 className="mr-1.5 size-3.5" />
                                Clear Logs
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {recentLogs ? (
                            <pre className="max-h-80 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                                {recentLogs}
                            </pre>
                        ) : (
                            <div className="py-8 text-center text-sm text-neutral-400">
                                No logs found or log file is empty.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminOpsIndex.layout = {
    breadcrumbs: [
        {
            title: 'System & Ops',
            href: OpsController.index.url(),
        },
    ],
};

