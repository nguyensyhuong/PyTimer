import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity } from 'react-native';
import { CheckBox, Text } from 'native-base';
import Identify from '../../../../helper/Identify';

export default class RememberEmailPass extends SimiComponent {

    onCheckRemember() {
        this.props.parent.setState((previousState) => {
            return { rememberMeEnable: !previousState.rememberMeEnable };
        });
    }

    renderPhoneLayout() {
        return (
            <TouchableOpacity
                style={{ flex: 1, marginTop: 25, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                onPress={() => { this.onCheckRemember() }}>
                <CheckBox color={'gray'}
                    checked={this.props.parent.state.rememberMeEnable}
                    style={{ width: 25, height: 25, left: 0 }}
                    onPress={() => { this.onCheckRemember() }} />
                <Text style={{ marginLeft: 10 }}>{Identify.__('Remember me')}</Text>
            </TouchableOpacity>
        );
    }
}