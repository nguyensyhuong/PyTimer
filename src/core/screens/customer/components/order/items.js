import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card } from 'native-base';
import ListQuoteItems from '../../../checkout/components/quoteitem/list';

export default class OrderSummary extends SimiComponent {
    renderPhoneLayout() {
        let items = [];
        let orderItems = this.props.order.order_items;
        for (let index in orderItems) {
            let item = {
                ...orderItems[index]
            };
            item['qty'] = item.qty_ordered;
            items.push(item);
        }
        return (
            <Card style={{ flex: 1 }} key={'items'}>
                <ListQuoteItems list={items} parent={this} from={'order_detail'} />
            </Card>
        );
    }
}