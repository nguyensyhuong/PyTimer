import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './listStyles';

export default class OrderItem extends SimiComponent {

    openOrderHistoryDetail = () => {
        NavigationManager.openPage(this.props.navigation, 'OrderHistoryDetail', {
            orderId: this.props.order.entity_id,
            order: this.props.order
        });
    }

    renderShipTo = (shipping) => {
        let shipTo = '';
        if (shipping.prefix !== undefined && shipping.prefix !== '' && shipping.prefix !== null) {
            shipTo += shipping.prefix;
        }

        if (shipping.firstname !== undefined && shipping.firstname !== '' && shipping.firstname !== null) {
            shipTo += ' ' + shipping.firstname;
        }

        if (shipping.lastname !== undefined && shipping.lastname !== '' && shipping.lastname !== null) {
            shipTo += ' ' + shipping.lastname;
        }

        if (shipping.suffix !== undefined && shipping.suffix !== '' && shipping.suffix !== null) {
            shipTo += ' ' + shipping.suffix;
        }

        return shipTo;
    }

    renderOrderNumber() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={styles.title}>{Identify.__('Order #')}</Text>
                <Text>{this.props.order.increment_id}</Text>
            </CardItem>
        );
    }

    renderDate() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={styles.title}>{Identify.__('Date')}</Text>
                <Text>{this.props.order.updated_at}</Text>
            </CardItem>
        );
    }

    renderShipping() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={styles.title}>{Identify.__('Ship To')}</Text>
                <Text>{this.renderShipTo(this.props.order.shipping_address)}</Text>
            </CardItem>
        );
    }

    renderOrderTotal() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={styles.title}>{Identify.__('Order Total')}</Text>
                <Text>{Identify.formatPriceWithCurrency(this.props.order.total.grand_total_incl_tax, this.props.order.total.currency_symbol)}</Text>
            </CardItem>
        );
    }

    renderStatus() {
        return (
            <CardItem listItemPadding={0}>
                <Text style={styles.title}>{Identify.__('Status')}</Text>
                <Text>{this.props.order.status}</Text>
            </CardItem>
        );
    }

    renderItem() {
        return (
            <Card style={{ flex: 1 }} key={this.props.order.entity_id}>
                {this.renderOrderNumber()}
                {this.renderDate()}
                {this.renderShipping()}
                {this.renderOrderTotal()}
                {this.renderStatus()}
            </Card>
        );
    }

    renderPhoneLayout() {
        return (
            <TouchableOpacity style={{ flex: 1 }}
                onPress={() => {
                    this.openOrderHistoryDetail();
                }}>
                {this.renderItem()}
            </TouchableOpacity>
        );
    }
}