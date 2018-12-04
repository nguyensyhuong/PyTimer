export default {
    product_buttons: [
        {
            active: true,
            content: require('../../../../plugins/facebook/share').default,
            position: 400
        }
    ],
    app_link: [
        {
            active: true,
            action: require('../../../../plugins/facebook/applink'),
        }
    ]
}