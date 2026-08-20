<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display a listing of all posts.
     */
    public function index(): Response
    {
        $posts = Post::query()
            ->with('category')
            ->latest()
            ->paginate(15);

        return Inertia::render('blog/admin/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        return Inertia::render('blog/admin/create', [
            'categories' => $this->categoryOptions(),
        ]);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(StoreBlogPostRequest $request): RedirectResponse
    {
        Post::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post created successfully.']);

        return to_route('admin.posts.index');
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(Post $post): Response
    {
        return Inertia::render('blog/admin/edit', [
            'post' => $post,
            'categories' => $this->categoryOptions(),
        ]);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(UpdateBlogPostRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post updated successfully.']);

        return to_route('admin.posts.index');
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post deleted successfully.']);

        return to_route('admin.posts.index');
    }

    /**
     * Get the available category options for selects.
     *
     * @return array<int, array{id: int, name: string}>
     */
    private function categoryOptions(): array
    {
        return Category::query()
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }
}
