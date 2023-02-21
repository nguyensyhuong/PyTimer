import React from 'react';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import createURL from './CreateURL';

export function onPlaceOrder(parent) {
    console.log(parent.selectedPayment);
    if(parent.selectedPayment.payment_method.toUpperCase() != 'PAYPAL_EXPRESS' || !Identify.TRUE(Identify.getMerchantConfig().storeview.paypal_express_config.enable_webview)) {
        return false;
    }
    let url = createURL(parent.props.quoteitems.quote_id);
    NavigationManager.clearStackAndOpenPage(parent.props.navigation, 'PaypalExpressWebView', {
        url: url
    });
    return true;
}