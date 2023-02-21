import { connect } from 'react-redux';
import { Toast } from 'native-base';
import WebViewPayment from '@screens/webview/WebViewPayment';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import { pp_webview, pp_shipping_method, pp_place_order } from '../../constants';
import { quoteitems } from '@helper/constants';
import Identify from '@helper/Identify';
import material from "@theme/variables/material";

const INJECTED_JAVASCRIPT = `(function() {
        var elems = document.getElementsByClassName('page-header');
        for (var i=0;i<elems.length;i+=1){
            elems[i].style.display = 'none';
        }
        var footer = document.getElementsByClassName('page-footer');
        for (var i=0;i<footer.length;i+=1){
            footer[i].style.display = 'none';
        }
})();`;

class PaypalExpressWebViewModule extends WebViewPayment {

    constructor(props) {
        super(props);
        this.orderInfo = this.props.navigation.getParam('orderInfo');
        this.state = {
            ...this.state,
            url: this.props.navigation.getParam('url') ? this.props.navigation.getParam('url') : '',
            reviewAddress: this.props.navigation.getParam('review_address') ? this.props.navigation.getParam('review_address') : ''
        };
        this.isRight = false;
        // this.isPaymentWebview = true;
        this.isPlaceOrder = false;
        this.isFromCheckout = this.props.navigation.getParam('fromCheckout') ? this.props.navigation.getParam('fromCheckout') : true;
        this.enableWebviewCheckout = Identify.TRUE(Identify.getMerchantConfig().storeview.paypal_express_config.enable_webview);
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none' && this.state.url === '' && !this.enableWebviewCheckout) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (this.state.url === '' && !this.enableWebviewCheckout) {
            new NewConnection()
                .init(pp_webview, 'pp_start', this)
                .connect();
        }
    }

    handleWhenRequestFail(requestID) {
        this.props.storeData('showLoading', { type: 'none' });
        this.requestGetQuoteItems();
        NavigationManager.backToRootPage(this.props.navigation);
    }

    setData(data, requestID) {
        if (data) {
            if (this.isPlaceOrder) {
                this.props.storeData('actions', [
                    { type: 'showLoading', data: { type: 'none' } },
                    { type: 'quoteitems', data: {} }
                ]);
                NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Thankyou', {
                    invoice: data.order.invoice_number
                });
            } else if (data.ppexpressapi) {
                if (data.ppexpressapi.hasOwnProperty('url')) {
                    this.props.storeData('showLoading', { type: 'none' });
                    this.setState({
                        url: data.ppexpressapi.url,
                        reviewAddress: data.ppexpressapi.review_address
                    });
                } else {
                    let shippings = data.ppexpressapi.methods;
                    if (shippings) {
                        let selectedShipping = null;
                        shippings.forEach(shippingMethod => {
                            if (shippings.indexOf(shippingMethod) == 0) {
                                selectedShipping = shippingMethod;
                            }
                            if (shippingMethod.s_method_selected) {
                                selectedShipping = shippingMethod;
                                return;
                            }
                        });
                        if (selectedShipping) {
                            this.requestPlaceOrder({
                                s_method: {
                                    method: selectedShipping.s_method_code
                                }
                            });
                        } else {
                            this.props.storeData('showLoading', { type: 'none' });
                            NavigationManager.openPage(this.props.navigation, 'PayPalExpressShipping');
                        }
                    }
                }
            } else if(requestID == 'pp_get_quote') {
                this.props.storeData('quoteitems', data);
            }
        }
    }

    requestGetQuoteItems() {
        new NewConnection()
            .init(quoteitems, 'pp_get_quote', this)
            .connect();
    }

    requestGetShippingMethod() {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(pp_shipping_method, 'pp_shipping_method', this)
            .connect();
    }

    requestPlaceOrder(bodyData) {
        this.isPlaceOrder = true;
        new NewConnection()
            .init(pp_place_order, 'pp_place_order', this, 'POST')
            .addBodyData(bodyData)
            .connect();
    }

    onSuccess() {
        if(this.enableWebviewCheckout) {
            Toast.show({
                text: Identify.__('Thank you for your purchase'),
                type: 'success',
                duration: 3000, textStyle: { fontFamily: material.fontFamily }
            });
            this.props.storeData('quoteitems', {});
            NavigationManager.backToRootPage(this.props.navigation);
        } else if (this.state.reviewAddress == '1') {
            NavigationManager.openPage(this.props.navigation, 'PayPalExpressAddress');
        } else if (this.isFromCheckout) {
            this.requestGetShippingMethod();
        } else {
            NavigationManager.openPage(this.props.navigation, 'PayPalExpressShipping');
        }
        return true;
    }

    addMorePropsToWebView() {
        // let orderID = this.orderInfo ? this.orderInfo.invoice_number : null;
        return ({
            url: this.state.url,
            keySuccess: this.enableWebviewCheckout ? 'checkout/onepage/success' : 'simiconnector/rest/v2/ppexpressapis/return',
            keyReview: 'checkout/cart',
            messageReview: Identify.__('Payment failure: Please try again'),
            injectedJavaScript: INJECTED_JAVASCRIPT
        });
    }

    render() {
        if (this.state.url === '') {
            return (null);
        } else {
            return (super.render());
        }
    }

}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressWebViewModule);