import React from 'react';
import BaseInput from './BaseInput';
import { Item, Icon, Input } from 'native-base';
import {TouchableOpacity} from 'react-native'
import NavigationManager from "../../../helper/NavigationManager";

export default class BorderedInput extends BaseInput {

    constructor(props) {
        super(props);
    }

    initData() {
        super.initData();
        this.iconName = this.props.iconName;
    }

    addWarningIcon = () => {
        if (this.state.success === true) {
            return (<Icon name={'ios-checkmark-circle'} />)
        } else if (this.state.error === true) {
            return (<Icon name={'ios-close-circle'} />)
        }
        return null;
    }

    onInputValueChange(text) {
        this.state.value = text;
        let validateResult = this.validateInputValue(text);
        this.parent.updateFormData(this.inputKey, text, validateResult);
        if (this.props.required === true) {
            if (validateResult === true) {
                this.setState({ success: true, error: false });
            } else {
                this.setState({ success: false, error: true });
            }
        }
    }
    onForgotPassWord(){
        NavigationManager.openPage(this.props.navigation, 'ForgotPassword')
    }
    createInputLayout() {
        return (
            <Item regular error={this.state.error} success={this.state.success} disabled={this.disabled} style={{ marginTop: 20, borderRadius: 4 }}>
                {this.iconName && <Icon active name={this.iconName} style={{ fontSize: 24, color: 'gray' }} />}
                <Input
                    placeholder={this.inputTitle}
                    keyboardType={this.keyboardType}
                    autoCapitalize='none'
                    clearButtonMode="while-editing"
                    secureTextEntry={this.inputType === 'password' ? true : false}
                    onChangeText={(text) => {
                        this.onInputValueChange(text);
                    }}
                    value={this.props.inputValue}
                    defaultValue={this.state.value}
                />
                {this.props.passwordExtraIcon && <TouchableOpacity key={'forgot'}
                                                                   onPress={() => {this.onForgotPassWord()}}>
                    <Icon style={{color: 'gray'}} name='ios-help-circle-outline'/>
                </TouchableOpacity>}
                {this.props.needWarning && this.addWarningIcon()}
            </Item>
        );
    }

}