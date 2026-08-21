import posts from './posts'
import categories from './categories'

const admin = {
    posts: Object.assign(posts, posts),
    categories: Object.assign(categories, categories),
}

export default admin