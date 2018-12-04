import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../helper/Identify';
import NavigationManager from '../../../../helper/NavigationManager';

export default class RegisterButton extends SimiComponent {

    onClickRegister() {
        NavigationManager.openPage(this.props.navigation, 'Customer', {
            isEditProfile: false
        });
    }

    renderPhoneLayout() {
        return (
            <Button style={{marginTop:30, flex:1, flexDirection: 'row', alignItems:'center', justifyContent: 'center',marginTop: 20}}
                transparent
                dark
                full
                bordered
                onPress={() => {this.onClickRegister()}}>
                <Text> {Identify.__('Create an account')} </Text>
            </Button>
        );
    }
}