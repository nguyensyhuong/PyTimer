import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import NewConnection from '@base/network/NewConnection';
import { Container, Content, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import AddressCheckout from '@screens/checkout/components/checkout/address';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import { pp_checkout_address } from '../../constants'

class PaypalExpressAddressModule extends SimiComponent {

    constructor(props) {
        super(props);
        this.isConfirmAddress = false;
        this.billingAddress = null;
        this.shippingAddress = null;
    }

    componentWillMount() {
        if (this.props.showLoading.type === 'none') {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        new NewConnection()
            .init(pp_checkout_address, 'pp_checkout_address', this)
            .connect();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    setData(data, requestID) {
        if (data && data.ppexpressapi) {
            if (!this.isConfirmAddress) {
                this.shippingAddress = data.ppexpressapi.shipping_address;
                this.billingAddress = data.ppexpressapi.billing_address;
            } else {
                this.timeout = setTimeout(() => {
                    NavigationManager.openPage(this.props.navigation, 'PayPalExpressShipping');
                }, 500);
            }
        }
        this.props.storeData('showLoading', { type: 'none' });
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    requestConfirmAddress() {
        this.isConfirmAddress = true;
        new NewConnection()
            .init(pp_checkout_address, 'pp_confirm_address', this, 'PUT')
            .addBodyData({
                b_address: this.billingAddress,
                s_address: this.shippingAddress
            })
            .connect();
    }

    renderPhoneLayout() {
        if (this.shippingAddress == null && this.billingAddress == null) {
            return (null);
        } else {
            return (
                <Container>
                    <Content>
                        <AddressCheckout
                            title={Identify.__('Order Shipping Address')}
                            parent={this}
                            data={this.shippingAddress}
                            navigation={this.props.navigation}
                            showEdit={false} />
                        <AddressCheckout
                            title={Identify.__('Order Billing Address')}
                            parent={this}
                            data={this.billingAddress}
                            navigation={this.props.navigation}
                            showEdit={false} />
                    </Content>
                    <Button full style={{ position: 'absolute', bottom: 0, width: '100%', height: 50 }} onPress={() => {
                        this.props.storeData('showLoading', { type: 'dialog' });
                        this.requestConfirmAddress();
                    }}>
                        <Text>{Identify.__('Confirm Address')}</Text>
                    </Button>
                </Container>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.order_review_data,
        showLoading: state.redux_data.showLoading
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressAddressModule);