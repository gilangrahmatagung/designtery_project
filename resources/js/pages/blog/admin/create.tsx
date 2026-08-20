import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

type PageProps = {
    categories: Pick<Category, 'id' | 'name'>[];
};

export default function AdminPostCreate() {
    const { categories } = usePage<PageProps>().props;
    const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);

    return (
        <>
            <Head title="New Post" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Heading title="New Post" description="Write and publish a new post" />

                <Form
                    {...PostController.store.form()}
                    encType="multipart/form-data"
                    options={{ preserveScroll: true }}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Post title"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="featured_image">Featured Image</Label>
                                <Input
                                    id="featured_image"
                                    name="featured_image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (file) {
                                            setFeaturedImagePreview(URL.createObjectURL(file));
                                        } else {
                                            setFeaturedImagePreview(null);
                                        }
                                    }}
                                />
                                {featuredImagePreview && (
                                    <img
                                        src={featuredImagePreview}
                                        alt="Featured image preview"
                                        className="mt-2 max-h-48 w-full rounded-md border border-neutral-200 object-cover dark:border-neutral-800"
                                    />
                                )}
                                <InputError message={errors.featured_image} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    defaultValue=""
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">No category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="content">Content</Label>
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={18}
                                    required
                                    placeholder="Write your post in markdown..."
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue="draft"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving…' : 'Create Post'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminPostCreate.layout = {
    breadcrumbs: [
        {
            title: 'Posts',
            href: PostController.index.url(),
        },
        {
            title: 'New Post',
            href: PostController.create.url(),
        },
    ],
};
