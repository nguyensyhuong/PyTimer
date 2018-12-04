import Quantity from './qty';
import { quoteitems } from '../../../../helper/constants';
import Connection from '../../../../base/network/Connection';
import styles from './AddToCartStyles';
import { Button, Text, Toast, View } from "native-base";
import React from 'react';
import { connect } from 'react-redux';
import Identify from '../../../../helper/Identify';
import SimiComponent from '../../../../base/components/SimiComponent';
import Events from '@helper/config/events';

class AddToCart extends SimiComponent {

    constructor(props) {
        super(props);
    }

    setData(data) {
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
        Toast.show({
            text: data.message[0],
            textStyle: { color: "yellow" },
            buttonText: "Okay",
            duration: 3000
        });
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
        data['sku'] = this.props.product.sku;
        data['qty'] = this.props.product.sku;
        Events.dispatchEventAction(data, this);
    }

    onClickAddToCart() {
        let params = {};

        let optionParams = this.props.parent.getOptionParams();
        if (optionParams != null) {
            params = {
                ...optionParams,
            };
        } else if (this.props.product.has_options == '1') {
            return;
        }

        params['product'] = this.props.product.entity_id;
        params['qty'] = this.qty.getCheckoutQty();

        this.tracking();        

        this.props.storeData('showLoading', { type: 'dialog' });
        Connection.restData();
        Connection.setBodyData(params);
        Connection.connect(quoteitems, this, 'POST');
    }

    render() {
        if (!this.props.product || this.props.product.is_salable != '1') {
            return (null);
        }
        return (
            <View style={styles.addToCart}>
                <Quantity onRef={ref => (this.qty = ref)} />
                <Button full style={{ flex: 1, marginLeft: 10 }} onPress={() => {this.onClickAddToCart()}}>
                    <Text>{Identify.__('Add To Cart')}</Text>
                </Button>
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddToCart);
