import WebViewPayment from './WebViewPayment';
import Identify from '../../core/helper/Identify';

export default class BraintreePayment extends WebViewPayment {

    constructor(props) {
        super(props);
        this.payment = this.props.navigation.getParam('payment');
        this.orderInfo = this.props.navigation.getParam('orderInfo');
    }

    addMorePropsToWebView() {
        return({
            url: this.orderInfo.url_action,
            orderID: this.orderInfo.invoice_number,
            keySuccess: this.orderInfo.successUrl,
            messageSuccess: Identify.__('Thank for your purchase'),
            keyError:this.orderInfo.errorUrl,
            messageError:Identify.__('Can not create invoice')
        });
    }
}
