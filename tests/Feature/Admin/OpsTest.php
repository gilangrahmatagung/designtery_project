<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login for admin ops index', function () {
    $this->get(route('admin.ops.index'))->assertRedirect(route('login'));
});

test('guests cannot run ops actions', function () {
    $this->post(route('admin.ops.run'), ['action' => 'optimize-clear'])
        ->assertRedirect(route('login'));
});

test('authenticated users can view ops dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.ops.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/ops/index')
            ->has('system')
            ->has('system.php_version')
            ->has('system.laravel_version')
            ->has('system.app_env')
            ->has('system.config_cached')
            ->has('system.db_connected')
            ->has('recentLogs')
        );
});

test('authenticated users can run optimize-clear action', function () {
    Artisan::spy();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.ops.run'), ['action' => 'optimize-clear'])
        ->assertRedirect(route('admin.ops.index'))
        ->assertSessionHas('last_command', function (array $lastCommand) {
            return $lastCommand['action'] === 'optimize-clear' && $lastCommand['status'] === 'success';
        });

    Artisan::shouldHaveReceived('call')->with('optimize:clear');
});

test('authenticated users can run migrate action', function () {
    Artisan::spy();

    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.ops.run'), ['action' => 'migrate'])
        ->assertRedirect(route('admin.ops.index'))
        ->assertSessionHas('last_command', function (array $lastCommand) {
            return $lastCommand['action'] === 'migrate' && $lastCommand['status'] === 'success';
        });

    Artisan::shouldHaveReceived('call')->with('migrate', ['--force' => true]);
});

test('invalid action returns validation error', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.ops.run'), ['action' => 'invalid-dangerous-action'])
        ->assertSessionHasErrors(['action']);
});
