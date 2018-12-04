export default {
    container: {
        default_vertical_products: {
            active: true,
            sort_order: 1000,
            content: require('../../../core/screens/catalog/components/verticalproducts').default
        },
        default_bottom: {
            active: true,
            sort_order: 2000,
            content: require('../../../core/screens/catalog/components/verticalproducts/bottom').default
        },
    },
    content: {
        
    }
}