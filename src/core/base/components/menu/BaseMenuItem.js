import React from 'react';
import SimiComponent from '../SimiComponent';
import { Card, CardItem, Icon, Text, Right } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Identify from '@helper/Identify';

export default class BaseMenuItem extends SimiComponent {
    renderPhoneLayout() {
        return (
            <TouchableOpacity style={{ flex: 1 }}
                onPress={() => {
                    if(!this.props.parent.onSelectMenuItem(this.props.keyItem)) {
                        this.props.onClick();
                    }
                }}>
                <Card style={{ shadowOpacity: 0 }}>
                    <CardItem style={{ flex: 1, paddingRight: 0, alignItems: 'center' }} backgroundColor={this.props.backgroundColor}>
                        <Icon name={this.props.iconName} />
                        <Text style={{ flex: 1, textAlign: 'left', marginLeft: 10, marginRight: 10 }}>{this.props.label}</Text>
                        <Right>
                            {this.props.extendable && <Icon style={{ marginRight: 10 }} name={Identify.isRtl() ? 'ios-arrow-back-outline' : "ios-arrow-forward-outline"} />}
                        </Right>

                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}