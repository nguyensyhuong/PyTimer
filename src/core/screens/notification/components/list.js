import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { FlatList } from 'react-native';
import { Text } from 'native-base';
import Identify from '@helper/Identify';
import NotificationItem from './item';

export default class NotificationList extends SimiComponent {
    generatePropsToFlatlist(){
        return {
            style: {marginLeft: 10, marginRight: 10},
            data : this.props.notifications,
            extraData: this.props.parent.props.data,
            showsVerticalScrollIndicator : false
        }
    }
    renderPhoneLayout() {
        if(this.props.notifications.length == 0) {
            return(
                <Text style={{ textAlign: 'center', marginTop: 90 }}>{Identify.__('You have not received any notifications')}</Text>
            );
        }
        return (
            <FlatList
                {...this.generatePropsToFlatlist()}
                keyExtractor={(item) => item.notice_id}
                renderItem={({ item }) =>
                    <NotificationItem notification={item} parent={this.props.parent}/>
                }
            />
        );
    }
}