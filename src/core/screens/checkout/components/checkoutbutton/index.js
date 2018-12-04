import React from 'react';
import {Text, Button, View, Input, Item, ActionSheet, Toast } from 'native-base';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import { address_book_mode, address_detail_mode } from '@helper/constants';
import Connection from "@base/network/Connection";
import Events from '@helper/config/events';

class Checkoutbutton extends React.Component{
    
  // componentDidMount(){
  //   Toast.show({
  //       text: this.props.parent.props.data.message[0],
  //       textStyle: { color: "yellow" },
  //       buttonText: "Okay",
  //       type: 'warning',
  //       duration: 4000
  //   });
  // }

  openAddressBook() {
      NavigationManager.openPage(this.props.parent.props.navigation, 'AddressBook', {
          mode: address_book_mode.checkout.select
      });
  }
  showCheckoutOptions() {

    let data = {};
     data['event'] = 'cart_action';
     data['action'] = 'clicked_checkout_button';
          
     Events.dispatchEventAction(data, this);

      let BUTTONS = [Identify.__('Checkout as existing customer'), Identify.__('Checkout as new customer'), Identify.__('Checkout as guest'), "Cancel"];
      let CANCEL_INDEX = 3;
      let routeName = null;
      if(Identify.getMerchantConfig().storeview.checkout.enable_guest_checkout != "1"){
        BUTTONS = [Identify.__('Checkout as existing customer'), Identify.__('Checkout as new customer'), "Cancel"]
        CANCEL_INDEX = 2;
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        routeName = 'Login';
                        params = {
                            isCheckout: true
                        };
                        break;
                    case 1:
                        routeName = 'NewAddress';
                        params = {
                            mode: address_detail_mode.checkout.as_new_customer.add_new
                        };
                        break;
                    default:
                        break;
                }
                if (routeName) {
                    NavigationManager.openPage(this.props.parent.props.navigation, routeName, params);
                }
            }
        );
      }else{
        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        routeName = 'Login';
                        params = {
                            isCheckout: true
                        };
                        break;
                    case 1:
                        routeName = 'NewAddress';
                        params = {
                            mode: address_detail_mode.checkout.as_new_customer.add_new
                        };
                        break;
                    case 2:
                        routeName = 'NewAddress';
                        params = {
                            mode: address_detail_mode.checkout.as_guest.add_new
                        };
                        break;
                    default:
                        break;
                }
                if (routeName) {
                    NavigationManager.openPage(this.props.parent.props.navigation, routeName, params);
                }
            }
        );
      }

  }
  render(){
    if (!this.props.parent.props.data.hasOwnProperty('is_can_checkout')
    || this.props.parent.props.data.is_can_checkout == "1") {
      return (
          <View style={{ position: 'absolute', bottom: 0, flex: 1, flexDirection: 'row' }}>
              <Button full onPress={() => {
                  if (Connection.getCustomer()) {
                      this.openAddressBook();
                  } else {
                      this.showCheckoutOptions();
                  }
              }} style={{ flex: 1, height: 50 }}>
                  <Text>{Identify.__("Checkout")}</Text>
              </Button>
          </View>
      );
    }
    return null;
  }
}

export default Checkoutbutton;
