import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { FlatList } from 'react-native';
import AddressItem from './item';

export default class AddressList extends SimiComponent {

    createListProps() {
        return {
            style: { marginLeft: 10, marginRight: 10 },
            data: this.props.addresses,
            extraData: this.props.parent.props.data
        };
    }

    renderItem(item) {
        return (
            <AddressItem address={item} parent={this.props.parent} />
        );
    }

    renderPhoneLayout() {
        return (
            <FlatList
                {...this.createListProps()}
                keyExtractor={(item) => item.entity_id}
                renderItem={({ item }) => this.renderItem(item)}
            />
        );
    }
}