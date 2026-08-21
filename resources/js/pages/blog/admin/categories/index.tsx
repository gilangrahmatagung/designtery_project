import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import CategoryController from '@/actions/App/Http/Controllers/Blog/CategoryController';
import { Button } from '@/components/ui/button';
import type { PaginatedCategories } from '@/types';

type PageProps = {
    categories: PaginatedCategories;
};

function CategoryRow({
    category,
}: {
    category: PaginatedCategories['data'][number];
}) {
    function handleDelete() {
        if (!confirm(`Delete category "${category.name}"?`)) {
return;
}

        router.delete(CategoryController.destroy.url(category), {
            preserveScroll: true,
        });
    }

    return (
        <tr className="border-b border-neutral-200 last:border-0 dark:border-neutral-800">
            <td className="py-3 pr-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {category.name}
                </div>
            </td>
            <td className="py-3 pr-4 text-sm text-neutral-500">
                {category.posts_count} {category.posts_count === 1 ? 'post' : 'posts'}
            </td>
            <td className="py-3 text-right">
                <button
                    onClick={handleDelete}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                    title="Delete category"
                >
                    <TrashIcon className="size-4" />
                </button>
            </td>
        </tr>
    );
}

export default function AdminCategoriesIndex() {
    const { categories } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Categories" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Categories
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            {categories.total}{' '}
                            {categories.total === 1 ? 'category' : 'categories'} total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={CategoryController.create.url()}>
                            <PlusIcon className="mr-2 size-4" />
                            New Category
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-neutral-200 px-4 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    {categories.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                            <p className="mb-4 text-sm">No categories yet.</p>
                            <Button asChild variant="outline" size="sm">
                                <Link href={CategoryController.create.url()}>
                                    Create your first category
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Name
                                    </th>
                                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Posts
                                    </th>
                                    <th className="py-3 text-right text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data.map((category) => (
                                    <CategoryRow key={category.id} category={category} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {categories.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {categories.prev_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={categories.prev_page_url}>← Previous</Link>
                            </Button>
                        )}
                        <span className="text-sm text-neutral-500">
                            Page {categories.current_page} of {categories.last_page}
                        </span>
                        {categories.next_page_url && (
                            <Button asChild variant="outline" size="sm">
                                <Link href={categories.next_page_url}>Next →</Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AdminCategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: CategoryController.index.url(),
        },
    ],
};