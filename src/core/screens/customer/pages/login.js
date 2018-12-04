import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '../../../base/components/SimiPageComponent';
import { Content, Container } from 'native-base';
import { customer_login, quoteitems, address_book_mode } from '../../../helper/constants';
import AppStorage from '../../../helper/storage';
import Connection from '@base/network/Connection';
import NavigationManager from '../../../helper/NavigationManager';
import variable from '@theme/variables/material';

class LoginPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            enableSignIn: this.props.navigation.getParam('email') ? true : false,
            rememberMeEnable: false
        };
        this.isCheckout = this.props.navigation.getParam('isCheckout') ? this.props.navigation.getParam('isCheckout') : false;
        this.shouldGetQuoteItems = false;
        this.customerData = null;
        this.loginData = {};
    }

    startLogin = () => {
        try {
            AppStorage.removeAllSavedInfo();
            Connection.setCustomer(null);
            this.loginData = this.form.getLoginData();
            this.props.storeData('showLoading', { type: 'dialog' });
            Connection.restData();
            Connection.setGetData(this.loginData);
            Connection.connect(customer_login, this, 'GET');
        } catch (e) {
            console.log(e.message);
        }
    }

    setData(data) {
        this.props.clearData();
        if (!this.shouldGetQuoteItems) {
            this.customerData = data;
            this.saveCustomerData();
            this.shouldGetQuoteItems = true;
            this.getQuoteItems();
        } else {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: this.customerData.customer },
                { type: 'quoteitems', data: data }
            ]);
            this.navigate();
        }
    }

    getQuoteItems() {
        Connection.restData();
        Connection.connect(quoteitems, this, 'GET');
    }

    saveCustomerData() {
        try {
            Connection.setCustomer(this.loginData);
            AppStorage.saveCustomerAutoLoginInfo(this.loginData);
            if (this.state.rememberMeEnable === true) {
                AppStorage.saveRemembermeLoginInfo(this.loginData);
            }
        } catch (error) {
            // Error saving data
        }
    }

    navigate = () => {
        this.props.navigation.goBack(null);
        if (this.isCheckout) {
            NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                isCheckout: true,
                mode: address_book_mode.checkout.select
            });
        }
    }

    updateButtonStatus(status) {
        if (status != this.state.enableSignIn) {
            this.setState({ enableSignIn: status });
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_login_form':
                return ref => (this.form = ref);
            default:
                return undefined;
        }
    }

    addMorePropsToComponent(element) {
        return {
            onRef: this.createRef(element.id)
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 50, backgroundColor: variable.appBackground }}>
                <Content>
                    {this.renderLayoutFromConfig('login_layout', 'content')}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.customer_data };
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        },
        clearData: () => {
            dispatch({ type: 'clear_all_data', data: null })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);