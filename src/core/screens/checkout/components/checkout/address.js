import React from 'react';
import { View, Text, Icon, ListItem, Left, Body } from 'native-base';
import NavigationManager from '../../../../helper/NavigationManager';
import { checkout_mode, address_detail_mode, address_book_mode } from "../../../../helper/constants";
import material from '../../../../../../native-base-theme/variables/material';
import SimiComponent from '../../../../base/components/SimiComponent';
import Events from '@helper/config/events';

class AddressCheckout extends SimiComponent {
    constructor(props) {
        super(props);
        this.data = null;
    }
    onEditAddress() {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'edited_address';
        Events.dispatchEventAction(data, this);
        switch (this.props.parent.mode) {
            case checkout_mode.exist_customer:
                routeName = 'AddressBook';
                params = {
                    mode: (this.props.title == 'Shipping Address') ? address_book_mode.checkout.edit_shipping : address_book_mode.checkout.edit_billing,
                    onSaveShippingAddress: this.props.parent.onSaveShippingAddress,
                    onSaveBillingAddress: this.props.parent.onSaveBillingAddress,
                };
                break;
            case checkout_mode.new_customer:
                routeName = 'NewAddress';
                params = {
                    mode: (this.props.title == 'Shipping Address') ? address_detail_mode.checkout.as_new_customer.edit_shipping : address_detail_mode.checkout.as_new_customer.edit_billing,
                    onSaveShippingAddress: this.props.parent.onSaveShippingAddress,
                    onSaveBillingAddress: this.props.parent.onSaveBillingAddress,
                    address: this.data
                };
                break;
            case checkout_mode.guest:
                routeName = 'NewAddress';
                params = {
                    mode: (this.props.title == 'Shipping Address') ? address_detail_mode.checkout.as_guest.edit_shipping : address_detail_mode.checkout.as_guest.edit_billing,
                    onSaveShippingAddress: this.props.parent.onSaveShippingAddress,
                    onSaveBillingAddress: this.props.parent.onSaveBillingAddress,
                    address: this.data
                };
                break;
            default:
                break;
        }
        if (routeName) {
            NavigationManager.openPage(this.props.navigation, routeName, params);
        }
    }

    renderAddressItem(iconName, textDisplay, hasComma=false, lineBreak=false, breakPosition){
        let text = textDisplay;
        if(textDisplay.length > 1){
            text = textDisplay.map((txt, i) => {
                if(hasComma){
                    if(i === textDisplay.length - 1){
                        return txt
                    }else if(lineBreak === true && i === breakPosition){
                        return <Text key={i} style={{fontSize: material.textSizeSmall, textAlign: 'left' }}>{txt}{"\n"}</Text>
                    }else {
                        return txt + ', '
                    }
                }else {
                    return txt + ' '
                }
            })
        }
        return(
            <ListItem icon noBorder>
                <Left>
                    <Icon name={iconName} />
                </Left>
                <Body>
                <Text style={{ fontSize: material.textSizeSmall, textAlign: 'left' }}>{text}</Text>
                </Body>
            </ListItem>
        )
    }

    renderPhoneLayout() {
        let title = this.props.title;
        if (title == "Shipping Address") {
            this.data = this.props.parent.props.data.order.shipping_address;
        } else if (title == "Billing Address") {
            this.data = this.props.parent.props.data.order.billing_address;
        } else {
            this.data = this.props.data;
        }
        return (
            <View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
                    <Text style={{ fontFamily: material.fontBold, flex: 1, textAlign: 'left' }}>{title}</Text>
                    <Icon style={{ marginLeft: 5, fontSize: 20 }} name="md-settings" onPress={() => {
                        this.onEditAddress();
                    }} />
                </View>
                {this.renderAddressItem("md-person", [this.data.firstname ,this.data.lastname])}
                {this.renderAddressItem("md-locate", [this.data.street ,this.data.city, this.data.region, this.data.postcode, this.data.country_name], true, true, 0)}
                {this.renderAddressItem("md-call", [this.data.telephone])}
                {this.renderAddressItem("md-mail", [this.data.email])}
            </View>
        );
    }
}

export default AddressCheckout;
