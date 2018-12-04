import React from 'react';
import SimiComponent from "../../../base/components/SimiComponent";
import { Icon, Text, Card, CardItem, Right } from "native-base";
import { StyleSheet, TouchableOpacity } from 'react-native';
import Identify from '@helper/Identify';

class SettingItem extends SimiComponent {
    constructor(props) {
        super(props)
        this.parent = this.props.parent;
    }
    render() {
        return (
            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.parent.itemAction(this.props.keyItem, this.props.ItemToShow)}>
                <Card style={{ shadowOpacity: 0 }}>
                    <CardItem icon style={{ flex: 1, paddingRight: 0, alignItems: 'center' }}>
                        <Icon active name={this.props.itemIcon} />
                        <Text style={{ flex: 1, textAlign: 'left', marginLeft: 10, marginRight: 10 }}>{this.props.ItemToShow}</Text>
                        <Text style={{ marginRight: 10, color: '#c9c9c9', textAlign: 'right' }}>{this.parent.getDataToShow(this.props.ItemName, this.props.hasDataInParent)}</Text>
                        <Right>
                            <Icon active style={{ marginRight: 10 }} name={Identify.isRtl() ? 'ios-arrow-back-outline' : "ios-arrow-forward-outline"} />
                        </Right>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        )
    }
}
export default SettingItem;