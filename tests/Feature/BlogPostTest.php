<?php

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

// --- Model & Factory ---

test('post can be created with factory', function () {
    $post = Post::factory()->create();

    expect($post)->toBeInstanceOf(Post::class)
        ->and($post->exists)->toBeTrue();
});

test('factory published state sets status and published_at', function () {
    $post = Post::factory()->published()->create();

    expect($post->status)->toBe(PostStatus::Published)
        ->and($post->published_at)->not->toBeNull();
});

test('factory draft state sets status and clears published_at', function () {
    $post = Post::factory()->draft()->create();

    expect($post->status)->toBe(PostStatus::Draft)
        ->and($post->published_at)->toBeNull();
});

test('slug is auto-generated from title when not provided', function () {
    $post = Post::factory()->create([
        'title' => 'Hello World Post',
        'slug' => '',
    ]);

    expect($post->slug)->toBe('hello-world-post');
});

test('auto-generated slug is unique when duplicate exists', function () {
    Post::factory()->create(['title' => 'Hello World', 'slug' => 'hello-world']);
    $post = Post::factory()->create(['title' => 'Hello World', 'slug' => '']);

    expect($post->slug)->toBe('hello-world-1');
});

test('published scope returns only published posts', function () {
    Post::factory()->published()->count(3)->create();
    Post::factory()->draft()->count(2)->create();

    expect(Post::published()->count())->toBe(3);
});

// --- Public routes ---

test('guests can view published posts list', function () {
    Post::factory()->published()->count(3)->create();

    $this->get(route('blog.index'))
        ->assertInertia(fn (Assert $page) => $page->component('blog/index'));
});

test('guests can view a published post by slug', function () {
    $post = Post::factory()->published()->create();

    $this->get(route('blog.show', $post->slug))
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/show')
            ->where('post.slug', $post->slug)
        );
});

test('guests get 404 for draft post', function () {
    $post = Post::factory()->draft()->create();

    $this->get(route('blog.show', $post->slug))->assertNotFound();
});

test('guests get 404 for non-existent slug', function () {
    $this->get(route('blog.show', 'tidak-ada'))->assertNotFound();
});

// --- Admin routes: guest redirect ---

test('guests are redirected to login for admin posts index', function () {
    $this->get(route('admin.posts.index'))->assertRedirect(route('login'));
});

test('guests are redirected to login for admin posts create', function () {
    $this->get(route('admin.posts.create'))->assertRedirect(route('login'));
});

test('guests cannot store a post', function () {
    $this->post(route('admin.posts.store'))->assertRedirect(route('login'));
});

// --- Admin routes: authenticated user ---

test('authenticated user can view admin posts index', function () {
    $user = User::factory()->create();
    Post::factory()->count(3)->create();

    $this->actingAs($user)
        ->get(route('admin.posts.index'))
        ->assertInertia(fn (Assert $page) => $page->component('blog/admin/index'));
});

test('authenticated user can view create post form', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.posts.create'))
        ->assertInertia(fn (Assert $page) => $page->component('blog/admin/create'));
});

test('authenticated user can store a new post', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.posts.store'), [
            'title' => 'My New Post',
            'content' => 'Post content here.',
            'status' => PostStatus::Draft->value,
        ])
        ->assertRedirect(route('admin.posts.index'));

    expect(Post::where('title', 'My New Post')->exists())->toBeTrue();
});

test('store post generates slug automatically', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.posts.store'), [
            'title' => 'Auto Slug Title',
            'content' => 'Content.',
            'status' => PostStatus::Draft->value,
        ]);

    expect(Post::where('slug', 'auto-slug-title')->exists())->toBeTrue();
});

test('store post sets published_at when status is published', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.posts.store'), [
            'title' => 'Published Post',
            'content' => 'Content.',
            'status' => PostStatus::Published->value,
        ]);

    $post = Post::where('title', 'Published Post')->firstOrFail();
    expect($post->published_at)->not->toBeNull();
});

test('store post fails validation without required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('admin.posts.store'), [])
        ->assertSessionHasErrors(['title', 'content', 'status']);
});

test('authenticated user can view edit post form', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.posts.edit', $post))
        ->assertInertia(fn (Assert $page) => $page
            ->component('blog/admin/edit')
            ->where('post.id', $post->id)
        );
});

test('authenticated user can update a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create(['title' => 'Old Title']);

    $this->actingAs($user)
        ->put(route('admin.posts.update', $post), [
            'title' => 'Updated Title',
            'content' => 'Updated content.',
            'status' => PostStatus::Draft->value,
        ])
        ->assertRedirect(route('admin.posts.index'));

    expect($post->fresh()->title)->toBe('Updated Title');
});

test('authenticated user can delete a post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->create();

    $this->actingAs($user)
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect(route('admin.posts.index'));

    expect(Post::find($post->id))->toBeNull();
});
