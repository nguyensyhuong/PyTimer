import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card, CardItem, Text } from 'native-base';
import Identify from '@helper/Identify';
import styles from './detailStyles';

export default class OrderSummary extends SimiComponent {

    renderOrderNumber() {
        return (
            <CardItem>
                <Text style={styles.title}>{Identify.__('Order #')}</Text>
                <Text>{this.props.order.increment_id}</Text>
            </CardItem>
        );
    }

    renderDate() {
        return (
            <CardItem>
                <Text style={styles.title}>{Identify.__('Date')}</Text>
                <Text>{this.props.order.updated_at}</Text>
            </CardItem>
        );
    }

    renderOrderTotal() {
        return (
            <CardItem>
                <Text style={styles.title}>{Identify.__('Order Total')}</Text>
                <Text>{Identify.formatPriceWithCurrency(this.props.order.total.grand_total_incl_tax, this.props.order.total.currency_symbol)}</Text>
            </CardItem>
        );
    }

    renderPhoneLayout() {
        return (
            <Card style={{ flex: 1 }} key={'base'}>
                {this.renderOrderNumber()}
                {this.renderDate()}
                {this.renderOrderTotal()}
            </Card>
        );
    }
}