import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Container, Content, Button, Text, Toast } from 'native-base';
import ShippingMethod from '@screens/checkout/components/checkout/shipping';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import { pp_shipping_method, pp_place_order } from '../../constants'
import material from "../../../../native-base-theme/variables/material";

class PaypalExpressShippingModule extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            shippings: null
        }
        this.isPlaceOrder = false;
        this.bodyData = null;
    }

    componentDidMount() {
        this.props.storeData('showLoading', { type: 'full' });
        new NewConnection()
            .init(pp_shipping_method, 'pp_shipping_method', this)
            .addGetData(data)
            .connect();
    }

    setData(data, requestID) {
        if (data) {
            if (this.isPlaceOrder) {
                NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Thankyou', {
                    invoice: data.order.invoice_number
                });
                this.props.storeData('actions', [
                    { type: 'showLoading', data: { type: 'none' } },
                    { type: 'quoteitems', data: {} }
                ]);
            } else if (data.ppexpressapi) {
                this.state.shippings = data.ppexpressapi.methods;

                if (this.state.shippings) {
                    this.state.shippings.forEach(shippingMethod => {
                        if (shippingMethod.s_method_selected) {
                            this.bodyData = {
                                s_method: {
                                    method: shippingMethod.s_method_code
                                }
                            }
                        }
                    });
                }
                this.props.storeData('showLoading', { type: 'none' });
            }
        }
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    onSaveMethod(bodyData, isInitRequest = false) {
        this.bodyData = bodyData;
        let newShippingData = JSON.parse(JSON.stringify(this.state.shippings));
        newShippingData.forEach(element => {
            if(bodyData.s_method.method == element.s_method_code) {
                element.s_method_selected = true;
            } else {
                element.s_method_selected = false;
            }
        });
        this.setState({shippings: newShippingData});
    }

    requestPlaceOrder() {
        this.isPlaceOrder = true;
        new NewConnection()
            .init(pp_place_order, 'pp_place_order', this, 'POST')
            .addBodyData(this.bodyData)
            .connect();
    }

    renderPhoneLayout() {
        if (this.state.shippings == null) {
            return (null);
        } else {
            return (
                <Container>
                    <Content>
                        <ShippingMethod
                            onRef={ref => (this.shipping = ref)}
                            title={Identify.__('Shipping Method')}
                            parent={this}
                            data={this.state.shippings}
                            navigation={this.props.navigation}
                            isPpexpress={true} />
                    </Content>
                    <Button full style={{ position: 'absolute', bottom: 0, width: '100%', height: 50 }} onPress={() => {
                        if (this.state.shippings.length > 0 && this.bodyData != null) {
                            this.props.storeData('showLoading', { type: 'dialog' });
                            this.requestPlaceOrder();
                        } else {
                            Toast.show({
                                text: Identify.__('Please select valid address'),
                                type: 'danger',
                                duration: 3000,
                                textStyle: { fontFamily: material.fontFamily }
                            });
                        }
                    }}>
                        <Text>{Identify.__('PLACE ORDER')}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressShippingModule);