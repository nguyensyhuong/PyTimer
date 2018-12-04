import React from 'react';
import { View, Text, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import Identify from '../../../../helper/Identify';
import material from '../../../../../../native-base-theme/variables/material';
import SimiComponent from '../../../../base/components/SimiComponent';
import Events from '@helper/config/events';

class PaymentMethod extends SimiComponent {

    constructor(props) {
        super(props);
        this.selectedPayment = null;
    }
    onSelectPayment(paymentMethod){
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'saved_payment_method';
        Events.dispatchEventAction(data, this);
        this.props.parent.onSaveMethod({
            p_method: {
                method: paymentMethod.payment_method
            }
        });
    }
    renderPaymentItem(paymentMethod){
        let showContent = (paymentMethod.hasOwnProperty('content') && paymentMethod.content && paymentMethod.p_method_selected) ? true : false;
        return(
            <TouchableOpacity key={paymentMethod.payment_method} onPress={() => {
                this.onSelectPayment(paymentMethod)
            }}>
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Icon name={paymentMethod.p_method_selected ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} />
                    <View style={{ marginLeft: 10 }}>
                        <Text>{paymentMethod.title}</Text>
                        {showContent && <Text style={{ fontSize: material.textSizeTiny }}>{paymentMethod.content}</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    createItems() {
        let items = [];
        let data = this.props.parent.props.data.order.payment
        for (let i in data) {
            let paymentMethod = data[i];
            if(paymentMethod.p_method_selected) {
                this.props.parent.selectedPayment = paymentMethod;
            }
            items.push(
                this.renderPaymentItem(paymentMethod)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        return (
            <View>
                <Text style={{ fontFamily: material.fontBold, flex: 1, backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__(this.props.title)}</Text>
                {this.createItems()}
            </View>
        );
    }
}

export default PaymentMethod;
