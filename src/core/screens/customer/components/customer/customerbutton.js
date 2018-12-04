import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../helper/Identify';

export default class CustomerButton extends SimiComponent {

    onClickButton() {
        this.props.parent.onCustomerAction();
    }

    render() {
        let text = 'Register';
        if(this.props.navigation.getParam('isEditProfile')) {
            text = 'Save';
        }
        return(
            <Button style={{position: 'absolute', bottom: 0, width: '100%', height: 56}}
                full
                disabled={!this.props.parent.state.enableButton}
                onPress={() => {this.onClickButton()}}>
                <Text> {Identify.__(text)} </Text>
            </Button>
        );
    }
}