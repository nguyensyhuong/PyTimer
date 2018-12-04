export default {
    container: {

    },
    content: {
        simi_apply_giftcode: {
            active: true,
            sort_order: 2001,
            content: require('../../../../plugins/giftcard/ApplyGiftCode').default,
            data: {
                api_config: 1
            }
        }
    }
}