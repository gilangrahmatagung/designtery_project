import { Head, Link, usePage } from '@inertiajs/react';
import { home, login } from '@/routes';
import * as blog from '@/routes/blog';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import type { PaginatedPosts, Post } from '@/types';

type PageProps = {
    posts: PaginatedPosts;
    auth: { user: { name: string } | null };
};

function PostCard({ post }: { post: Post }) {
    return (
        <article className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
                <time dateTime={post.published_at ?? post.created_at}>
                    {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </time>
            </div>

            <h2 className="text-xl font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                <Link
                    href={blog.show(post.slug)}
                    className="hover:underline hover:decoration-neutral-400 underline-offset-4"
                >
                    {post.title}
                </Link>
            </h2>

            {post.excerpt && (
                <p className="line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                    {post.excerpt}
                </p>
            )}

            <Link
                href={blog.show(post.slug)}
                className="mt-auto text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-current dark:text-neutral-100 dark:decoration-neutral-600"
            >
                Read more →
            </Link>
        </article>
    );
}

export default function BlogIndex() {
    const { posts, auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Blog" />

            <div className="min-h-screen bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <header className="border-b border-neutral-200 dark:border-neutral-800">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                        <Link href={home()} className="text-lg font-semibold">
                            Blog
                        </Link>
                        <nav className="flex items-center gap-4 text-sm">
                            {auth.user ? (
                                <Link
                                    href={PostController.index.url()}
                                    className="rounded-sm border border-neutral-300 px-4 py-1.5 hover:border-neutral-500 dark:border-neutral-700 dark:hover:border-neutral-500"
                                >
                                    Admin
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="rounded-sm border border-transparent px-4 py-1.5 hover:border-neutral-300 dark:hover:border-neutral-700"
                                >
                                    Log in
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-12">
                    {posts.data.length === 0 ? (
                        <p className="text-center text-neutral-500">No posts yet.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {posts.data.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="mt-10 flex items-center justify-center gap-2">
                            {posts.prev_page_url && (
                                <Link
                                    href={posts.prev_page_url}
                                    className="rounded-sm border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-500 dark:border-neutral-700"
                                >
                                    ← Previous
                                </Link>
                            )}
                            <span className="text-sm text-neutral-500">
                                Page {posts.current_page} of {posts.last_page}
                            </span>
                            {posts.next_page_url && (
                                <Link
                                    href={posts.next_page_url}
                                    className="rounded-sm border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-500 dark:border-neutral-700"
                                >
                                    Next →
                                </Link>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
