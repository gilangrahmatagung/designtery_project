export type PostStatus = 'draft' | 'published';

export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface CategoryWithCount extends Category {
    posts_count: number;
}

export interface PaginatedCategories {
    data: CategoryWithCount[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface Post {
    id: number;
    category_id: number | null;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    featured_image_url: string | null;
    status: PostStatus;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    category?: Pick<Category, 'id' | 'name'> | null;
}

export interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}
