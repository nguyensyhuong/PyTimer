import React from 'react';
import { connect } from 'react-redux';
import { Toast } from 'native-base';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity, Image } from 'react-native';
import NewConnection from '@base/network/NewConnection';
import NavigationManager from '@helper/NavigationManager';
import { quoteitems } from '@helper/constants';
import Identify from '@helper/Identify';
import AppStorage from '@helper/storage';
import createURL from '../modules/CreateURL';

class PaypalExpressStart extends SimiComponent {

    constructor(props) {
        super(props);
    }

    setData(data, requestID) {
        if (!Identify.TRUE(data.is_can_checkout)) {
            data['reload_data'] = true;
        }
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
        if (data.quote_id && data.quote_id != null && data.quote_id != '') {
            AppStorage.saveData('quote_id', data.quote_id);
        }
        this.openRedirect();
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    onAddProductToCart() {
        this.isAddToCart = true;
        let params = {};
        if (this.props.product.has_options == '1') {
            let optionParams = this.props.parent.getOptionParams();
            if (optionParams != null) {
                params = {
                    ...optionParams,
                };
            } else {
                return;
            }
        }
        params['product'] = this.props.product.entity_id;
        params['qty'] = '1';

        this.props.storeData('showLoading', { type: 'dialog' });

        new NewConnection()
            .init(quoteitems, 'pp_add_to_cart', this, 'POST')
            .addBodyData(params)
            .connect();
    }

    openNormalCheckout() {
        NavigationManager.openPage(this.props.navigation, 'PaypalExpressWebView', {
            fromCheckout: false
        });
    }

    openWebViewCheckout() {
        let quoteId = this.props.data.quote_id;
        if(!quoteId) {
            if(this.props.data.quoteitems && this.props.data.quoteitems.length > 0) {
                quoteId = this.props.data.quoteitems[0].quote_id;
            }
            if(!quoteId) {
                Toast.show({
                    text: Identify.__('Cannot start Paypal Express Checkout. Direct to cart page and try again'),
                    type: 'danger',
                    duration: 3000
                });
                return;
            }
        }
        let url = createURL(quoteId);
        NavigationManager.openPage(this.props.navigation, 'PaypalExpressWebView', {
            url: url
        });
    }

    openRedirect() {
        if (Identify.TRUE(Identify.getMerchantConfig().storeview.paypal_express_config.enable_webview)) {
            let enableGuestCheckout = Identify.TRUE(Identify.getMerchantConfig().storeview.checkout.enable_guest_checkout);
            let customerData = Identify.getCustomerData();
            if (customerData || (!customerData && enableGuestCheckout)) {
                this.openWebViewCheckout();
            } else {
                NavigationManager.openPage(this.props.navigation, 'Login', {
                    callback: () => {
                        NavigationManager.backToPreviousPage(this.props.navigation);
                        this.openWebViewCheckout();
                    }
                });
            }
        } else {
            this.openNormalCheckout();
        }
    }

    renderPhoneLayout() {
        let isFromProduct = false;
        if (this.props.product) {
            isFromProduct = true;
        }

        let expressConfig = Identify.getMerchantConfig().storeview.paypal_express_config;
        if (!expressConfig || (isFromProduct && !Identify.TRUE(expressConfig.show_on_product_detail)) || (!isFromProduct && !Identify.TRUE(expressConfig.show_on_cart))) {
            return null;
        }

        return (
            <TouchableOpacity style={isFromProduct ? { flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 10 } : { flex: 1 }} onPress={() => {
                if (isFromProduct) {
                    this.onAddProductToCart();
                } else {
                    this.openRedirect();
                }
            }}>
                <Image source={isFromProduct ? require('../../../../media/background_paypalexpress.png') : require('../../../../media/background_paypalexpress_cart.png')}
                    style={{ width: '100%', height: 50, resizeMode: "stretch" }} />
            </TouchableOpacity>
        );
    }

}

const mapStateToProps = (state) => {
    return { data: state.redux_data.quoteitems };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressStart);