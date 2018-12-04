import React from 'react';
import { View } from 'react-native';

export default class BaseInput extends React.Component {

    constructor(props) {
        super(props);
        this.keyboardType = 'default';
        this.state = {
            success: false,
            error: false,
            value: ''
        };
        this.initData();
    }

    createInputLayout() {
        return null;
    }

    initData() {
        this.inputKey = this.props.inputKey;
        this.inputTitle = this.props.inputTitle;
        if (this.props.required === true) {
            this.inputTitle = this.inputTitle + '*';
        }
        this.inputType = this.props.inputType;
        this.disabled = this.props.disabled;
        this.parent = this.props.parent;
        if (this.props.inputValue !== undefined) {
            this.state.value = this.props.inputValue;
        }
        if (this.inputType === 'email') {
            this.keyboardType = 'email-address';
        } else if (this.inputType === 'phone') {
            this.keyboardType = 'phone-pad';
        }
    }

    render() {
        return (
            <View>
                {this.createInputLayout()}
            </View>
        );
    }

    validateInputValue = (text) => {
        if (this.inputType === 'email') {
            return this.validateEmail(text);
        } else if (this.inputType === 'password' && this.props.required === true) {
            return this.validatePassword(text);
        } else if (this.props.required === true) {
            if (text.length > 0)
                return true;
            else
                return false;
        }
        return true;
    }

    validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }

    validatePassword = (password) => {
        if (password.length >= 6) {
            return true;
        }
        return false;
    }

}