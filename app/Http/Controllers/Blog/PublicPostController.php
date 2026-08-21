<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class PublicPostController extends Controller
{
    /**
     * Display a listing of published posts.
     */
    public function index(): Response
    {
        $posts = Post::published()
            ->latest('published_at')
            ->paginate(10);

        return Inertia::render('blog/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Display the specified published post.
     */
    public function show(string $slug): Response
    {
        $post = Post::published()
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('blog/show', [
            'post' => $post,
        ]);
    }
}
