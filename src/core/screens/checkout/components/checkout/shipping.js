import React from 'react';
import { View, Text, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Identify from '../../../../helper/Identify';
import material from '../../../../../../native-base-theme/variables/material';
import SimiComponent from '../../../../base/components/SimiComponent';
import Events from '@helper/config/events';

class ShippingMethod extends SimiComponent {
    onSelectShippingMethod(shippingMethod){
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'saved_shipping_method';
        Events.dispatchEventAction(data, this);
        this.props.parent.onSaveMethod({
            s_method:{
                method: shippingMethod.s_method_code
            }
        });
    }
    renderShippingItem(shippingMethod){
        return(
            <TouchableOpacity key={shippingMethod.s_method_code} onPress={() => {
                this.onSelectShippingMethod(shippingMethod)
            }}>
                <View style={{borderBottomWidth: 0.5, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15}}>
                    <Icon name={shippingMethod.s_method_selected ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'}/>
                    <View style={{marginLeft: 10, flex: 1}}>
                        <Text style={{textAlign: 'left'}}>{shippingMethod.s_method_title}</Text>
                        <Text style={{fontSize: material.textSizeSmall, textAlign: 'left'}}>{shippingMethod.s_method_name}</Text>
                    </View>
                    <Text style={{marginLeft: 10}}>{Identify.formatPrice(shippingMethod.s_method_fee)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    createItems() {
        let items = [];
        let data = this.props.parent.props.data.order.shipping
        for(let i in data) {
            let shippingMethod = data[i];
            items.push(
                this.renderShippingItem(shippingMethod)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        return(
            <View>
                <Text style={{fontFamily: material.fontBold, flex: 1, backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left'}}>{Identify.__(this.props.title)}</Text>
                {this.createItems()}
            </View>
        );
    }
}

export default ShippingMethod;
