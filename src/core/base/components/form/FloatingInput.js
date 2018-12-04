import React from 'react';
import BaseInput from './BaseInput';
import { Item, Input, Label, Icon } from 'native-base';

export default class FloatingInput extends BaseInput {

    constructor(props) {
        super(props);
    }

    addWarningIcon = ()=> {
        if (this.state.success === true){
            return (<Icon name={'ios-checkmark-circle'}/>)
        }else if(this.state.error === true){
            return (<Icon name={'ios-close-circle'}/>)
        }
        return null;
    }

    onInputValueChange(text) {
        this.state.value = text;
        let validateResult = this.validateInputValue(text);
        this.parent.updateFormData(this.inputKey, text, validateResult);
        if (this.props.required === true) {
            if (validateResult === true) {
                this.setState({success: true, error: false});
            } else {
                this.setState({success: false, error: true});
            }
        } else {
            this.setState({success: true, error: false});
        }
    }

    createInputLayout() {
        return (
            <Item error={this.state.error}
                success={this.state.success}
                disabled={this.disabled}
                floatingLabel style={{ marginLeft: 0, paddingLeft: 0 }}>
                <Label>{this.inputTitle}</Label>
                <Input disabled={this.disabled}
                    keyboardType={this.keyboardType}
                    value={this.state.value}
                    clearButtonMode={'while-editing'}
                    secureTextEntry={this.inputType === 'password' ? true : false}
                    onChangeText={(text) => {
                        this.onInputValueChange(text);
                    }}
                    style={this.disabled ? {color:'gray'} : {}}
                    autoCapitalize = 'none'
                />
                {this.addWarningIcon()}
            </Item>
        );
    }

}