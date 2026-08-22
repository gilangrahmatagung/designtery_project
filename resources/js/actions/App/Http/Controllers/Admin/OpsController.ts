import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/ops',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\OpsController::index
* @see app/Http/Controllers/Admin/OpsController.php:20
* @route '/admin/ops'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Admin\OpsController::run
* @see app/Http/Controllers/Admin/OpsController.php:32
* @route '/admin/ops/run'
*/
export const run = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

run.definition = {
    methods: ["post"],
    url: '/admin/ops/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OpsController::run
* @see app/Http/Controllers/Admin/OpsController.php:32
* @route '/admin/ops/run'
*/
run.url = (options?: RouteQueryOptions) => {
    return run.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OpsController::run
* @see app/Http/Controllers/Admin/OpsController.php:32
* @route '/admin/ops/run'
*/
run.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: run.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OpsController::run
* @see app/Http/Controllers/Admin/OpsController.php:32
* @route '/admin/ops/run'
*/
const runForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OpsController::run
* @see app/Http/Controllers/Admin/OpsController.php:32
* @route '/admin/ops/run'
*/
runForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: run.url(options),
    method: 'post',
})

run.form = runForm

const OpsController = { index, run }

export default OpsController