import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3 } from 'native-base';
import Price from './price/index';
import styles from './styles';

export default class ProductNamePriceComponent extends SimiComponent {

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
    renderPrice() {
        if (this.props.product.type_id !== 'grouped') {
            return <Price type={this.props.product.type_id}
                          prices={this.props.product.app_prices}
                          styleDiscount={styles.price}
                          onRef={ref => (this.prices = ref)}/>
        }
    }
    renderPhoneLayout() {
        if(this.props.product == null) {
            return (null);
        }
        return (
            <Card style={styles.card}>
                <H3 style={{textAlign: 'left'}}>{this.props.product.name}</H3>
                {this.renderPrice()}
            </Card>
        );
    }

    updatePrices(newPrices) {
        this.prices.updatePrices(newPrices);
    }
}