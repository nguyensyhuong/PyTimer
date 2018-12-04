import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import SimiForm from '@base/components/form/SimiForm';
import BorderedInput from '@base/components/form/BorderedInput';
import AppStorage from '../../../../helper/storage';
import Identify from "../../../../helper/Identify";

export default class LoginForm extends SimiComponent {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.navigation.getParam('email'),
            password: this.props.navigation.getParam('password')
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }

        if (!this.props.navigation.getParam('email')) {
            AppStorage.getCustomerRemebermeLoginInfo().then((rememberInfo) => {
                if (rememberInfo && rememberInfo.email) {
                    this.setState({ email: rememberInfo.email, password: rememberInfo.password });
                    this.props.parent.setState({ rememberMeEnable: true, enableSignIn: true });
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    updateButtonStatus(status) {
        this.props.parent.updateButtonStatus(status);
    }

    fillLoginData(loginData) {
        this.setState(loginData);
        this.form.setFormData(loginData);
    }
    createFields() {
        let fields = [];

        fields.push(
            <BorderedInput key={'email'}
                           inputKey={'email'}
                           inputTitle={'Email'}
                           inputType={'email'}
                           iconName={'person'}
                           inputValue={this.state.email}
                           required={true}
                           needWarning={true}
            />
        );

        fields.push(
            <BorderedInput key={'password'}
                           inputKey={'password'}
                           inputTitle={'Password'}
                           inputType={'password'}
                           iconName={'lock'}
                           inputValue={this.state.password}
                           required={true}
                           needWarning={false}
                           passwordExtraIcon={true}
            />
        );

        return fields;
    }

    renderPhoneLayout() {
        return (
            <SimiForm fields={this.createFields()} initData={this.state} parent={this} onRef={ref => (this.form = ref)} />
        );
    }

    getLoginData() {
        return this.form.getFormData();
    }
}