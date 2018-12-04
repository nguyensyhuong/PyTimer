import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card } from 'native-base';
import Total from '../../../checkout/components/totals';

export default class OrderTotal extends SimiComponent {
    renderPhoneLayout() {
        return (
            <Card style={{ flex: 1 }} key={'total'}>
                <Total totals={this.props.order.total} currency_symbol={this.props.order.total.currency_symbol} />
            </Card>
        );
    }
}