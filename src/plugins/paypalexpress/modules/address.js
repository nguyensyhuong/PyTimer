import React from 'react';
import SimiComponent from '../../../core/base/components/SimiComponent';
import Connection from '../../../core/base/network/Connection';
import { Container, Content, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import AddressCheckout from '../../../core/screens/checkout/components/checkout/address';
import Identify from '../../../core/helper/Identify';
import NavigationManager from '../../../core/helper/NavigationManager';
import {pp_checkout_address} from '../../constants'
class PaypalExpressAddressModule extends SimiComponent {

    constructor(props) {
        super(props);
        this.billingAddress = null;
        this.shippingAddress = null;
        this.isConfirmAddress = false;
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none') {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        Connection.restData();
        Connection.connect(pp_checkout_address, this, 'GET');
    }

    setData(data) {
        if (data && data.ppexpressapi) {
            if (!this.isConfirmAddress) {
                this.shippingAddress = data.ppexpressapi.shipping_address;
                this.billingAddress = data.ppexpressapi.billing_address;
            } else {
                NavigationManager.openPage(this.props.navigation, 'PayPalExpressShipping');
            }
        }
        this.props.storeData('showLoading', { type: 'none' });
    }

    requestConfirmAddress() {
        this.isConfirmAddress = true;
        Connection.restData();
        Connection.setBodyData({
            billingAddress: this.billingAddress,
            shippingAddress: this.shippingAddress
        });
        Connection.connect(pp_checkout_address, this, 'PUT');
    }

    renderPhoneLayout() {
        if (this.shippingAddress == null && this.billingAddress == null) {
            return (null);
        } else {
            return (
                <Container>
                    <Content>
                        <AddressCheckout title={Identify.__('Shipping Address')} parent={this} data={this.shippingAddress} navigation={this.props.navigation} />
                        <AddressCheckout title={Identify.__('Billing Address')} parent={this} data={this.billingAddress} navigation={this.props.navigation} />
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
export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressAddressModule);