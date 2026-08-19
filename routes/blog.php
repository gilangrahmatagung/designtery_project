<?php

use App\Http\Controllers\Blog\PostController;
use App\Http\Controllers\Blog\PublicPostController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/blog', [PublicPostController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [PublicPostController::class, 'show'])->name('blog.show');

// Admin routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('posts', PostController::class)->except(['show']);
});
