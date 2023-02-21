import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Container } from 'native-base';
import PaypalExpressWebViewModule from '../modules/webview';

export default class PayPalExpressWebView extends SimiComponent {

    renderPhoneLayout() {
        return (
            <PaypalExpressWebViewModule parent={this} navigation={this.props.navigation} />
        );
    }

}