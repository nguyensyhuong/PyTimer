export default {
    container: {

    },
    content: {
        simi_apply_giftcode: {
            active: true,
            sort_order: 4010,
            title_content: 'Apply Gift Code',
            content: require('../../../../plugins/giftcard/ApplyGiftCode').default,
            data: {
                api_config: 2
            }
        }
    }
}