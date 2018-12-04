import React from 'react';
import SimiComponent from '../../../core/base/components/SimiComponent';
import { Container } from 'native-base';
import PaypalExpressWebViewModule from '../modules/webview';

export default class PayPalExpressWebView extends SimiComponent {

    constructor(props) {
        super(props);
        this.isPage = true;
    }

    renderPhoneLayout() {
        return (
            <Container>
                <PaypalExpressWebViewModule navigation={this.props.navigation} />
            </Container>
        );
    }

}