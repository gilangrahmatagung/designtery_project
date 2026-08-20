import { Head } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import CategoryController from '@/actions/App/Http/Controllers/Blog/CategoryController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminCategoryCreate() {
    return (
        <>
            <Head title="New Category" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Heading title="New Category" description="Create a new category" />

                <Form
                    {...CategoryController.store.form()}
                    options={{ preserveScroll: true }}
                    className="max-w-2xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Category name"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving…' : 'Create Category'}
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

AdminCategoryCreate.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: CategoryController.index.url(),
        },
        {
            title: 'New Category',
            href: CategoryController.create.url(),
        },
    ],
};