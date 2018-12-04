import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../helper/Identify';

export default class AddressButton extends SimiComponent {

    onSaveAddress() {
        this.props.parent.editNewAddress();
    }

    render() {
        return(
            <Button style={{position: 'absolute', bottom: 0, width: '100%', height: 56}}
                full
                disabled={!this.props.parent.state.buttonEnabled}
                onPress={() => {this.onSaveAddress()}}>
                <Text> {Identify.__('Save')} </Text>
            </Button>
        );
    }
}