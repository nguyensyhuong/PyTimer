import React from 'react';
import {Text, Button } from 'native-base';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';

class Place extends React.Component{
  render(){
    return (
      <Button full style={{ position: 'absolute', bottom: 0, width: '100%', height: 50 }} onPress={() => {
          let data = {};
          data['event'] = 'checkout_action';
          data['action'] = 'clicked_place_order_button';
          Events.dispatchEventAction(data, this);
          this.props.parent.onPlaceOrder();
      }}>
          <Text>{Identify.__('Place Order')}</Text>
      </Button>
    );
  }
}

export default Place;
