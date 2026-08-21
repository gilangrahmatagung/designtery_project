import Blog from './Blog'
import Settings from './Settings'

const Controllers = {
    Blog: Object.assign(Blog, Blog),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers