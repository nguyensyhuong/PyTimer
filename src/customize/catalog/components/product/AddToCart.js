import { Alert, Keyboard } from 'react-native';
import Quantity from '@screens/catalog/components/product/qty';
import { quoteitems } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import styles from '@screens/catalog/components/product/AddToCartStyles';
import { Button, Text, Toast, View } from "native-base";
import React from 'react';
import { connect } from 'react-redux';
import Identify from '@helper/Identify';
import SimiComponent from '@base/components/SimiComponent';
import Events from '@helper/config/events';
import material from "@theme/variables/material";
import AppStorage from '@helper/storage';

class AddToCart extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            ... this.state,
            isSpecialOrder: props.product.special_order ? true : false
        }
        this.storeConfig = Identify.getMerchantConfig().storeview.base;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product.special_order !== this.props.product.special_order) {
            if(this.props.product.special_order != '0') {
                this.setState({ ...this.state, isSpecialOrder: true})
            }
            else {
                this.setState({ ...this.state, isSpecialOrder: false})
            }
        }
    }

    setData(data) {
        if (!Identify.TRUE(data.is_can_checkout)) {
            data['reload_data'] = true;
        }

        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
        if (data.quote_id && data.quote_id != null && data.quote_id != '' && !Identify.getCustomerData()) {
            AppStorage.saveData('quote_id', data.quote_id);
        }
        if (data.message && data.message.length > 0) {
            Toast.show({
                text: Identify.__(data.message[0]),
                textStyle: { color: "yellow", fontFamily: material.fontFamily },
                duration: 3000
            });
        }
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    tracking() {
        let data = {};
        data['event'] = 'product_action';
        data['action'] = 'added_to_cart';
        data['product_name'] = this.props.product.name;
        data['product_id'] = this.props.product.entity_id;
        data['price'] = this.props.product.price;
        data['sku'] = this.props.product.sku;
        data['qty'] = this.qty.getCheckoutQty();
        Events.dispatchEventAction(data, this);
    }

    onClickAddToCart() {
        let params = {};

        let optionParams = this.props.parent.getOptionParams();
        if (optionParams != null) {
            params = {
                ...optionParams,
            };
        } else if (this.props.product.has_options == '1' || this.props.product.type_id == 'grouped') {
            return;
        }

        params['product'] = this.props.product.entity_id;
        let qty = this.qty ? this.qty.getCheckoutQty() : '1';
        if (isNaN(qty) || parseInt(qty) == 0) {
            Alert.alert(
                Identify.__('Error'),
                Identify.__('Quantity is not valid')
            );
            return;
        }
        params['qty'] = qty;
        Keyboard.dismiss();
        if (parseInt(qty, 10) > 0) {
            this.tracking();

            this.props.storeData('showLoading', { type: 'dialog' });

            newConnection = new NewConnection();
            newConnection.init(quoteitems, 'add_to_cart', this, 'POST');
            newConnection.addBodyData(params);
            newConnection.connect();
        }
    }

    render() {
        let showButton = true;
        if (this.storeConfig && this.storeConfig.hasOwnProperty('is_show_price_for_guest') &&
            this.storeConfig.is_show_price_for_guest == '0' && !Identify.getCustomerData()) {
            showButton = false;
        }
        if (!this.props.parent.product || this.props.product.is_salable != '1' || !showButton) {
            return (null);
        }
        let text_button = 'Add To Cart'
        if (Identify.getMerchantConfig().storeview?.preOrder && 
            Identify.getMerchantConfig().storeview.preOrder.enable && this.state.isSpecialOrder) 
                text_button = Identify.getMerchantConfig().storeview.preOrder.preorder_text_button
        return (
            <View style={styles.addToCart}>
                <Quantity onRef={ref => (this.qty = ref)} />
                <Button full style={{ flex: 1, marginLeft: 10 }} onPress={() => { this.onClickAddToCart() }}>
                    <Text>{Identify.__(text_button)}</Text>
                </Button>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.quoteitems,
        customer_data: state.redux_data.customer_data,
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);
