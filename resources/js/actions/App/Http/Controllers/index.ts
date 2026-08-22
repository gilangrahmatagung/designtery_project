import Blog from './Blog'
import Admin from './Admin'
import Settings from './Settings'

const Controllers = {
    Blog: Object.assign(Blog, Blog),
    Admin: Object.assign(Admin, Admin),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers