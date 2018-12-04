import React from 'react';
import { Container } from 'native-base';
import WebViewPayment from '../../core/base/components/payment/webview';
import SimiComponent from "../../core/base/components/SimiComponent";
import { HeaderApp } from "../../core/base/components/layout/config";

export default class WebViewPaymentPage extends SimiComponent {

    constructor(props){
      super(props);
      this.isPage = true;
    }

    onSuccess() {
        return false;
    }

    onFail() {
        return false;
    }

    onError() {
        return false;
    }

    onReview() {
        return false;
    }

    addMorePropsToWebView() {
        return {};
    }

    renderPhoneLayout() {
        return (
            <Container>
                <HeaderApp navigation={this.props.navigation} back={true} show_right={false}/>
                <WebViewPayment parent={this}
                    navigation={this.props.navigation}
                    {...this.addMorePropsToWebView()} />
            </Container>
        );
    }

}
