<?php

use App\Http\Controllers\Blog\CategoryController;
use App\Http\Controllers\Blog\PostController;
use App\Http\Controllers\Blog\PublicPostController;
use Illuminate\Support\Facades\Route;

// Public blog routes
Route::get('/', [PublicPostController::class, 'index'])->name('home');
Route::get('/posts/{slug}', [PublicPostController::class, 'show'])->name('blog.show');

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('posts', PostController::class)->except(['show']);
    Route::resource('categories', CategoryController::class)->except(['show', 'edit', 'update']);
});

require __DIR__.'/settings.php';
