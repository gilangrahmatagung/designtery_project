import { Head, Link, usePage } from '@inertiajs/react';
import { home, login } from '@/routes';
import * as blog from '@/routes/blog';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import type { Post } from '@/types';

type PageProps = {
    post: Post;
    auth: { user: { name: string } | null };
};

export default function BlogShow() {
    const { post, auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title={post.title} />

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
                    <Link
                        href={home()}
                        className="mb-8 inline-block text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                        ← Back to blog
                    </Link>

                    <article>
                        <header className="mb-8">
                            <h1 className="mb-3 text-3xl font-bold leading-tight text-neutral-900 dark:text-neutral-100">
                                {post.title}
                            </h1>
                            <time
                                dateTime={post.published_at ?? post.created_at}
                                className="text-sm text-neutral-500"
                            >
                                {new Date(post.published_at ?? post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            {post.excerpt && (
                                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
                                    {post.excerpt}
                                </p>
                            )}
                        </header>

                        {post.featured_image && (
                            <img
                                src={post.featured_image}
                                alt={post.title}
                                className="mb-8 w-full rounded-xl object-cover"
                            />
                        )}

                        {/* Render markdown as plain text for now — will be replaced with proper renderer */}
                        <div className="prose prose-neutral max-w-none dark:prose-invert">
                            <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-neutral-800 dark:text-neutral-200">
                                {post.content}
                            </pre>
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
}
