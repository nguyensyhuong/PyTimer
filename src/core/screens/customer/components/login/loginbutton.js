import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../helper/Identify';

export default class LoginButton extends SimiComponent {

    onClickLogin() {
        this.props.parent.startLogin();
    }

    renderPhoneLayout() {
        return (
            <Button style={{marginTop:30, flex:1, flexDirection: 'row', alignItems:'center', justifyContent: 'center',}}
                full
                disabled={!this.props.parent.state.enableSignIn}
                onPress={() => {this.onClickLogin()}}>
                <Text> {Identify.__('Sign In')} </Text>
            </Button>
        );
    }
}