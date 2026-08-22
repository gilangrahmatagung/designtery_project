import posts from './posts'
import categories from './categories'
import ops from './ops'

const admin = {
    posts: Object.assign(posts, posts),
    categories: Object.assign(categories, categories),
    ops: Object.assign(ops, ops),
}

export default admin