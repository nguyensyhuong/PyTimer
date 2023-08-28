import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, View, Text } from 'native-base';
import Price from '@screens/catalog/components/product/price/index';
import styles from '@screens/catalog/components/product/styles';
import Identify from '../../../../core/helper/Identify';
import { TouchableNativeFeedbackBase } from 'react-native';

export default class ProductNamePriceComponent extends SimiComponent {
    constructor(props) {
        super(props)
        this.state = {
            check: false
        }
        this.availableDate = '2/2/2023'
        this.preOrderMessage = 'This product is temporarily out of stock. You can pre order it to get 20% off!'
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    checkTypeIdAndPrice() {
        // if (this.props.product.type_id === 'configurable' && this.props.product.app_prices && this.props.product.app_prices.price == 0) {
        //     return false;
        // }
        return true;
    }

    formatDate(date) {
        let tmp = ''
        for (let i = 0; i < date.length; i++) {
            if (date[i] != ' ') tmp += date[i]
            else break;
        }
        return tmp;
    }

    renderPrice() {
        if (this.props.product.type_id !== 'grouped' && this.checkTypeIdAndPrice()) {
            return <Price type={this.props.product.type_id}
                prices={this.props.product.app_prices}
                tierPrice={this.props.product.app_tier_prices}
                styleDiscount={styles.price}
                onRef={ref => (this.prices = ref)}
                navigation={this.props.navigation} />
        }
    }
    renderPreOrderDate() {
        if (this.props.product.pre_order_from_date && this.props.product.pre_order_to_date) {
            return <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{Identify.__('AVAILABILITY DATE')}: {Identify.__('from')} {this.formatDate(this.props.product.pre_order_from_date)} {Identify.__('to')} {this.formatDate(this.props.product.pre_order_to_date)}</Text>
        }
        else if (this.props.product.pre_order_from_date) {
            return <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{Identify.__('AVAILABILITY DATE')}: {this.formatDate(this.props.product.pre_order_from_date)}</Text>
        }
        else if (this.props.product.pre_order_to_date) {
            return <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{Identify.__('AVAILABILITY DATE')}: {this.formatDate(this.props.product.pre_order_to_date)}</Text>
        }
        else return null
    }
    renderPreOrderMessage() {
        if (this.props.product.pre_order_message)
            return <Text>{Identify.__(this.props.product.pre_order_message)}</Text>
        else return <Text>{Identify.__(Identify.getMerchantConfig().storeview?.preOrder.message_products)}</Text>
    }
    renderPreOrderInfo() {
        if (Identify.getMerchantConfig().storeview?.preOrder && Identify.getMerchantConfig().storeview?.preOrder?.enable) {
            if (this.props.product.pre_order_status &&
                ((this.props.product.pre_order_status == '2' && !this.props.product?.quantity_and_stock_status?.is_in_stock) || this.props.product.pre_order_status == '1')) {
                return (
                    <View style={{ marginTop: 10 }}>
                        {this.renderPreOrderDate()}
                        {this.renderPreOrderMessage()}
                    </View>
                )
            } else if (this.state.check) {
                return (
                    <View style={{ marginTop: 10 }}>
                        {this.renderPreOrderDate()}
                        {this.renderPreOrderMessage()}
                    </View>
                )
            }
            else return null
        }
        else return null
    }
    renderPhoneLayout() {
        if (this.props.product == null) {
            return (null);
        }
        return (
            <Card style={styles.card}>
                <H3 style={{ textAlign: 'left' }}>{this.props.product.name}</H3>
                <View style={{ marginTop: 7 }}>
                    {this.renderPrice()}
                    {this.renderPreOrderInfo()}
                </View>
            </Card>
        );
    }

    updatePrices(newPrices, check = false) {
        this.setState({
            check: check
        });
        if(this.prices) {
            this.prices.updatePrices(newPrices);
        }
    }
}