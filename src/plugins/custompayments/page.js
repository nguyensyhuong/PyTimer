import React from 'react';
import { connect } from 'react-redux';
import { order_history, quoteitems } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import { Toast } from 'native-base';
import material from "@theme/variables/material";
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import { Platform } from 'react-native';
import WebViewPayment from '@base/components/payment/webview';
import SimiPageComponent from "@base/components/SimiPageComponent";

class CustomPayment extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.payment = this.props.navigation.getParam('payment');
        this.orderInfo = this.props.navigation.getParam('orderInfo');
        this.customPayment = this.props.navigation.getParam('customPayment');
        this.mode = this.props.navigation.getParam('mode');
        this.quoteId = this.props.navigation.getParam('quoteId');
        this.isRight = false;
        // this.isPaymentWebview = true;
    }

    getOrderId() {
        this.showLoading('showLoading', { type: 'dialog' });
        new NewConnection()
            .init('simiconnector/rest/v2/orderidfrquoteids' + '/' + this.quoteId, 'get_order_id', this)
            .connect();
    }

    updateCart() {
        new NewConnection()
            .init(quoteitems, 'get_quoteitems', this)
            .connect();
    }

    onSuccess() {
        if (this.quoteId) {
            this.getOrderId();
            return true;
        }
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

    openThankyouPage(params) {
        NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Thankyou', params);
    }

    setData(data, requestId) {
        this.showLoading('showLoading', { type: 'none' });
        if (requestId == 'get_order_id') {
            if (data.orderidfrquoteid.status == 'processing') {
                this.openThankyouPage({
                    invoice: data.orderidfrquoteid.increment_id,
                    mode: this.mode,
                });
            } else {
                this.updateCart();
                Toast.show({
                    text: this.customPayment.message_fail,
                    type: 'warning',
                    duration: 3000, textStyle: { fontFamily: material.fontFamily }
                });
                NavigationManager.backToRootPage(this.props.navigation);
            }
        } else if (requestId === 'get_quoteitems') {
            data['reload_data'] = true;
            this.props.storeData('actions', [
                { type: 'quoteitems', data: data }
            ]);
            if (data.message) {
                let messages = data.message;
                let message = messages[0];
                Toast.show({
                    text: Identify.__(message),
                    duration: 3000
                });
            }
        } else {
            Toast.show({
                text: Identify.__('Your order has been canceled'),
                type: 'success',
                duration: 3000,
                textStyle: { fontFamily: material.fontFamily }
            });
            NavigationManager.backToRootPage(this.props.navigation);
        }
    }

    cancelOrder() {
        this.showLoading('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(order_history + '/' + this.orderInfo.invoice_number, 'cancel_order', this, 'PUT')
            .addBodyData({ status: 'cancel' })
            .connect();
    }

    addMorePropsToWebView() {
        return ({
            notification: this.orderInfo.notification,
            url: this.orderInfo.url_action,
            orderID: this.orderInfo.invoice_number,
            mode: this.mode,
            keySuccess: this.customPayment.url_success,
            messageSuccess: this.customPayment.message_success,
            keyFail: this.customPayment.url_fail,
            messageFail: this.customPayment.message_fail,
            keyError: this.customPayment.url_error,
            messageError: this.customPayment.message_error,
            keyReview: this.customPayment.url_cancel,
            messageReview: this.customPayment.message_cancel,
            showLoading: Platform.OS == 'android' && this.payment.payment_method.toLowerCase() == 'afterpaypayovertime' ? false : true
        });
    }

    renderPhoneLayout() {
        return (
            <WebViewPayment parent={this}
                navigation={this.props.navigation}
                onRef={ref => (this.webView = ref)}
                {...this.addMorePropsToWebView()} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        quoteitems: state.redux_data.quoteitems
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomPayment);