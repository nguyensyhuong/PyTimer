export default {
    payments: [
        {
            active: true,
            payment_method: 'PAYPAL_EXPRESS',
            router_name: 'PaypalExpressWebView'
        }
    ],
    paypal_express_cart: [
        {
            active: true,
            content: require('../../../../plugins/paypalexpress/modules/start').default,
            position: 100
        }
    ],
    on_place_order : [
        {
            active: true,
            action: require('../../../../plugins/paypalexpress/modules/OnPlaceOrder')
        }
    ]
}