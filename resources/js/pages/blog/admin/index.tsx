import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import * as blog from '@/routes/blog';
import type { PaginatedPosts, Post } from '@/types';

type PageProps = {
    posts: PaginatedPosts;
};

function StatusBadge({ status }: { status: Post['status'] }) {
    return (
        <Badge variant={status === 'published' ? 'default' : 'secondary'}>
            {status}
        </Badge>
    );
}

function PostRow({ post }: { post: Post }) {
    function handleDelete() {
        if (!confirm(`Delete "${post.title}"?`)) return;
        router.delete(PostController.destroy.url(post), {
            preserveScroll: true,
        });
    }

    return (
        <tr className="border-b border-neutral-200 last:border-0 dark:border-neutral-800">
            <td className="py-3 pr-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {post.title}
                </div>
                <div className="mt-0.5 text-xs text-neutral-500">{post.slug}</div>
            </td>
            <td className="py-3 pr-4">
                <StatusBadge status={post.status} />
            </td>
            <td className="py-3 pr-4 text-sm text-neutral-500">
                {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                      })
                    : '—'}
            </td>
            <td className="py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    {post.status === 'published' && (
                        <Link
                            href={blog.show(post.slug)}
                            target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                            title="View post"
                        >
                            <EyeIcon className="size-4" />
                        </Link>
                    )}
                    <Link
                        href={PostController.edit.url(post)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                        title="Edit post"
                    >
                        <PencilIcon className="size-4" />
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                        title="Delete post"
                    >
                        <TrashIcon className="size-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function AdminPostsIndex() {
    const { posts } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Posts" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Posts
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            {posts.total} {posts.total === 1 ? 'post' : 'posts'} total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={PostController.create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    {posts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                            <p className="mb-4 text-sm">No posts yet.</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href={PostController.create.url()}>
                                    Create your first post
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Title
                                    </th>
                                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Status
                                    </th>
                                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Published
                                    </th>
                                    <th className="py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.data.map((post) => (
                                    <PostRow key={post.id} post={post} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {posts.prev_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={posts.prev_page_url}>← Previous</Link>
                            </Button>
                        )}
                        <span className="text-sm text-neutral-500">
                            Page {posts.current_page} of {posts.last_page}
                        </span>
                        {posts.next_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={posts.next_page_url}>Next →</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AdminPostsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Posts',
            href: PostController.index.url(),
        },
    ],
};
