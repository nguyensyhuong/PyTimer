import React from 'react';
import SimiComponent from '../../../core/base/components/SimiComponent';
import { Container, Content, Button, Text, Toast } from 'native-base';
import ShippingMethod from '../../../core/screens/checkout/components/checkout/shipping';
import { connect } from 'react-redux';
import Connection from '../../../core/base/network/Connection';
import Identify from '../../../core/helper/Identify';
import NavigationManager from '../../../core/helper/NavigationManager';
import {pp_shipping_method, pp_place_order} from '../../constants'
class PaypalExpressShippingModule extends SimiComponent {

    constructor(props) {
        super(props);
        this.shippings = null;
        this.isPlaceOrder = false;
        this.bodyData = null;
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none') {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        Connection.restData();
        Connection.connect(pp_shipping_method, this, 'GET');
    }

    setData(data) {
        if (data) {
            if (this.isPlaceOrder) {
                Toast.show({
                    text: Identify.__('Thank you for your purchase'),
                    type: 'success',
                    buttonText: "Okay",
                    duration: 3000
                });
                NavigationManager.backToRootPage(this.props.navigation);
                this.props.navigation.goBack(null);
            } else if (data.ppexpressapi) {
                this.shippings = data.ppexpressapi.methods;

                if (this.shippings) {
                    this.shippings.forEach(shippingMethod => {
                        if (shippingMethod.s_method_selected) {
                            this.bodyData = {
                                s_method: {
                                    method: shippingMethod.s_method_code
                                }
                            }
                        }
                    });
                }
            }
        }
        this.props.storeData('showLoading', { type: 'none' });
    }

    onSaveMethod(bodyData, isInitRequest = false) {
        this.bodyData = bodyData;
    }

    requestPlaceOrder() {
        this.isPlaceOrder = true;
        Connection.restData();
        Connection.setBodyData(this.bodyData);
        Connection.connect(pp_place_order, this, 'POST');
    }

    renderPhoneLayout() {
        if (this.shippings == null) {
            return (null);
        } else {
            return (
                <Container>
                    <Content>
                        <ShippingMethod parent={this} data={this.shippings} navigation={this.props.navigation} />
                    </Content>
                    <Button full style={{ position: 'absolute', bottom: 0, width: '100%', height: 50 }} onPress={() => {
                        if (this.shippings.length > 0 && this.bodyData != null) {
                            this.props.storeData('showLoading', { type: 'dialog' });
                            this.requestPlaceOrder();
                        }
                    }}>
                        <Text>{Identify.__('Place Order')}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressShippingModule);