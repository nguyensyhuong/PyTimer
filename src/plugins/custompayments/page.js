import WebViewPayment from '../braintree/WebViewPayment';

export default class CustomPayment extends WebViewPayment {

    constructor(props) {
        super(props);
        this.payment = this.props.navigation.getParam('payment');
        this.orderInfo = this.props.navigation.getParam('orderInfo');
        this.customPayment = this.props.navigation.getParam('customPayment');
    }

    addMorePropsToWebView() {
        return({
            url: this.orderInfo.url_action,
            orderID: this.orderInfo.invoice_number,
            keySuccess: this.customPayment.url_success,
            messageSuccess: this.customPayment.message_success,
            keyFail: this.customPayment.url_fail,
            messageFail: this.customPayment.message_fail,
            keyError: this.customPayment.url_error,
            messageError: this.customPayment.message_error,
            keyReview: this.customPayment.url_cancel,
            messageReview: this.customPayment.message_cancel,
        });
    }
}