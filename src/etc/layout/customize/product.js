
export default {
    container: {
        
    },
    content: {
        default_description: {
            active: true,
            sort_order: 4000,
            content: require('../../../customize/catalog/components/product/description').default,
            position: 'right'
        },
        default_option: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/catalog/components/product/option').default,
            position: 'right'
        },
    }
}