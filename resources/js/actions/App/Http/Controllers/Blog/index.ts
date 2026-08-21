import PublicPostController from './PublicPostController'
import PostController from './PostController'
import CategoryController from './CategoryController'

const Blog = {
    PublicPostController: Object.assign(PublicPostController, PublicPostController),
    PostController: Object.assign(PostController, PostController),
    CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Blog