import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { Card, CardItem, Icon, H3, Right } from 'native-base';
import Identify from '@helper/Identify';
import material from '../../../../../../native-base-theme/variables/material';

export default class AddNewAddress extends SimiComponent {

    onClickAddNew() {
        this.props.parent.addNewAddress()
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {this.onClickAddNew()}}>
                <Card style={{marginLeft: 12, marginRight: 12, marginTop:12, height: 50}}>
                    <CardItem style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name={'add-circle'} />
                        <H3 style={{fontFamily: material.fontBold, flex: 1, marginLeft: 10}}>{Identify.__('Add an address')}</H3>
                        <Right>
                            <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} style={{ color: 'black' }} />
                        </Right>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}