export default {
    container: {
        
    },
    content: {
        plugin_fb_login: {
            active: true,
            sort_order: 3100,
            content: require('../../../../plugins/facebook/login').default
        }
    }
}