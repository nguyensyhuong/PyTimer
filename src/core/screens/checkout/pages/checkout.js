import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import Connection from "@base/network/Connection";
import { connect } from 'react-redux';
import { ScrollView } from 'react-native'
import { Container, Content, Toast } from 'native-base';
import { onepage } from '@helper/constants';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import variable from '@theme/variables/material';
import Events from '@helper/config/events';

class Checkout extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state
        };
        this.isPlace = false;
        this.mode = this.props.navigation.getParam('mode');
        this.shippingAddressParams = this.props.navigation.getParam('shippingAddressParams');
        this.billingAddressParams = this.props.navigation.getParam('billingAddressParams');
        this.list = null;
        this.totals = null;
        this.selectedPayment = null;
        this.isRight = false;
        this.onSaveShippingAddress = this.onSaveShippingAddress.bind(this);
        this.onSaveBillingAddress = this.onSaveBillingAddress.bind(this);
        this.acceptTerm = false;
    }

    componentWillMount() {
        if (this.props.showLoading.type === 'none') {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }
    onSaveAddress(isInitRequest = false) {
        this.onSaveMethod({
            b_address: this.billingAddressParams,
            s_address: this.shippingAddressParams
        }, isInitRequest);
    }
    onSaveShippingAddress(shippingParams) {
        this.shippingAddressParams = shippingParams;
        this.onSaveAddress();
    }
    onSaveBillingAddress(billingParams) {
        this.billingAddressParams = billingParams;
        this.onSaveAddress();
    }
    onSaveMethod(bodyData, isInitRequest = false) {
        if (!isInitRequest) {
            this.props.storeData('showLoading', { type: 'dialog' });
        }
        Connection.restData();
        Connection.setBodyData(bodyData);
        Connection.connect(onepage, this, 'PUT');
    }
    isCanPlaceOrder() {
        let isShippingSelected = false;
        let isPaymentSelected = false;
        this.props.data.order.shipping.forEach(element => {
            if (element.s_method_selected) {
                isShippingSelected = true;
            }
        });
        this.props.data.order.payment.forEach(element => {
            if (element.p_method_selected) {
                isPaymentSelected = true;
            }
        });
        if (!isShippingSelected) {
            Toast.show({
                text: Identify.__('Please select shipping method'),
                buttonText: "Okay",
                type: "danger"
            })
            return false;
        }
        if (!isPaymentSelected) {
            Toast.show({
                text: Identify.__('Please select payment method'),
                buttonText: "Okay",
                type: "danger"
            })
            return false;
        }
        if (!this.acceptTerm) {
            Toast.show({
                text: Identify.__('Please accept term and condition'),
                buttonText: "Okay",
                type: "danger"
            })
            return false;
        }
        return true;
    }
    onPlaceOrder() {
        if (this.isCanPlaceOrder()) {
            this.isPlace = true;
            this.props.storeData('showLoading', { type: 'dialog' });
            Connection.restData();
            Connection.connect(onepage, this, 'POST');
        }
    }
    componentDidMount() {
        this.onSaveAddress(true)
    }
    onPlaceOrderSuccess(order) {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'place_order_successful';
        data['grand_total'] = this.totals.grand_total_incl_tax ? this.totals.grand_total_incl_tax : this.totals.grand_total;
        Events.dispatchEventAction(data, this);
        switch (this.selectedPayment.show_type) {
            case 1:
                break;
            case 3:
                this.processPaymentWebView(order);
                break;
            default:
                if (!this.processCustomPayment(order)) {
                    NavigationManager.openRootPage(this.props.navigation, 'Thankyou', {
                        invoice: order.invoice_number
                    });
                }
                break;
        }
    }
    processPaymentWebView(order) {
        let selectedPaymentId = this.selectedPayment.payment_method.toUpperCase();
        let routerName = '';
        let params = {
            orderInfo: order,
            payment: this.selectedPayment,
        };
        for (let i = 0; i < Events.events.payments.length; i++) {
            let node = Events.events.payments[i];
            if (node.active === true && node.payment_method.toUpperCase() === selectedPaymentId) {
                routerName = node.router_name;
            }
        }
        if (routerName === '' && !Identify.isEmpty(this.props.customPayment)) {
            this.props.customPayment.forEach(payment => {
                if (payment.paymentmethod.toUpperCase() === selectedPaymentId) {
                    routerName = 'CustomPayment';
                    params['customPayment'] = payment;
                }
            });
        }
        NavigationManager.openRootPage(this.props.navigation, routerName, params);
    }
    setData(data) {
        if (this.isPlace) {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'quoteitems', data: {} }
            ]);
            this.props.storeData('showLoading', { type: 'none' });
            if (data.order) {
                this.onPlaceOrderSuccess(data.order);
            }
        } else {
            this.list = this.props.quoteitems.quoteitems;
            this.totals = data.order.total;
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'order_review_data', data: data }
            ]);
        }
    }
    processCustomPayment(order) {
        if (!Identify.isEmpty(this.props.customPayment)) {
            this.props.customPayment.forEach(payment => {
                if (payment.paymentmethod.toUpperCase() === selectedPaymentId) {
                    NavigationManager.openRootPage(this.props.navigation, 'CustomPayment', {
                        orderInfo: order,
                        payment: this.selectedPayment,
                        customPayment: payment
                    });
                    return true;
                }
            });
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            title: element.title_content ? element.title_content : '',
            from: 'checkout'
        };
    }

    shouldRenderLayoutFromConfig() {
        if (!Identify.isEmpty(this.props.data)) {
            return true;
        }
        return false;
    }

    renderPhoneLayout() {
        return (
            <Container style={{ backgroundColor: variable.appBackground }}>
                <Content>
                    <ScrollView style={{ paddingBottom: 60 }}>
                        {this.renderLayoutFromConfig('checkout_layout', 'content')}
                    </ScrollView>
                </Content>
                {this.renderLayoutFromConfig('checkout_layout', 'container')}
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        data: state.redux_data.order_review_data,
        quoteitems: state.redux_data.quoteitems,
        customPayment: state.redux_data.customPayment,
        showLoading: state.redux_data.showLoading
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
// export default Checkout;
