import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ScrollView, FlatList } from 'react-native';
import { Spinner } from 'native-base';
import styles from './listStyles';
import OrderItem from './item';

export default class OrdersList extends SimiComponent {

    createListProps() {
        return {
            style: styles.verticalList,
            data: this.props.orders,
            extraData: this.props.parent.state.data,
            showsVerticalScrollIndicator: false
        }
    }

    renderItem(item) {
        return(
            <OrderItem order={item} />
        );
    }

    renderPhoneLayout() {
        let showLoadMore = this.props.parent.state.loadMore;
        return (
            <ScrollView
                onScroll={({ nativeEvent }) => {
                    if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
                        this.props.parent.onEndReached();
                    }
                }}
                scrollEventThrottle={400}>
                <FlatList
                    {...this.createListProps()}
                    keyExtractor={(item) => item.entity_id}
                    renderItem={({ item }) => this.renderItem(item)} />
                <Spinner style={showLoadMore ? {} : { display: 'none' }} />
            </ScrollView>
        );
    }
}