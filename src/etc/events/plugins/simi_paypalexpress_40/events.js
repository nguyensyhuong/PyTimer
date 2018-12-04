export default {
    payments : [
        {
            active: true,
            payment_method: 'PAYPAL_EXPRESS',
            router_name: 'PaypalExpressWebView'
        }
    ],
    giftcard_checkout : [
        {
            active: true,
            content: require('../../../../plugins/paypalexpress/modules/start').default,
            position: 300
        }
    ]
}