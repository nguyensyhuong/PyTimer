import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, View, Text } from 'native-base';
import Price from '@screens/catalog/components/product/price/index';
import styles from '@screens/catalog/components/product/styles';
import Identify from '../../../../core/helper/Identify';
import { TouchableNativeFeedbackBase } from 'react-native';

export default class ProductNamePriceComponent extends SimiComponent {
    constructor(props){
        super(props)
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
        if (this.props.product.type_id === 'configurable' && this.props.product.app_prices && this.props.product.app_prices.price == 0) {
            return false;
        }
        return true;
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
    renderPreOrderInfo() {
        if(this.props.product.is_salable == '1') {
            return (
                <View style={{ marginTop: 10}}>
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{Identify.__(`AVAILABILITY DATE: ${this.availableDate}`)}</Text>
                    <Text>{Identify.__(this.preOrderMessage)}</Text>
                </View>
            )
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
                {this.renderPrice()}
                {this.renderPreOrderInfo()}
            </Card>
        );
    }

    updatePrices(newPrices) {
        this.prices.updatePrices(newPrices);
    }
}