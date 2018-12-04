import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Alert, View } from 'react-native';
import { Content, Container } from 'native-base';
import Connection from '@base/network/Connection';
import variable from '@theme/variables/material';
import { customers } from '@helper/constants';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

class CustomerPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.loginPage = this.props.navigation.getParam('parent');
        this.isEditProfile = this.props.navigation.getParam('isEditProfile');
        this.state = {
            ...this.state,
            enableButton: this.isEditProfile ? true : false
        };
    }

    onCustomerAction() {
        if (this.isEditProfile) {
            this.editProfile();
        } else {
            this.createNewAccount();
        }
    }

    createNewAccount = () => {
        this.customerData = this.form.getCustomerData();
        if (this.customerData.password !== this.customerData.com_password) {
            Alert.alert(
                'Error',
                Identify.__('Password and Confirm password don\'t match'),
            );
            return;
        }
        this.requestCustomerAction();
    }

    editProfile() {
        let currentPassword = '';
        let newPassword = '';
        let confirmPassword = '';
        this.customerData = this.form.getCustomerData();
        if (this.customerData.password) {
            currentPassword = this.customerData.password;
        }
        if (this.customerData.new_password) {
            newPassword = this.customerData.new_password;
        }
        if (this.customerData.com_password) {
            confirmPassword = this.customerData.com_password;
        }
        if (currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0) {
            if (newPassword !== confirmPassword) {
                Alert.alert(
                    'Error',
                    Identify.__('Password and Confirm password don\'t match'),
                );
                return;
            } else if (newPassword.length < 6) {
                Alert.alert(
                    'Error',
                    Identify.__('Please enter 6 or more characters'),
                );
                return;
            } else {
                this.customerData.change_password = '1';
            }
            this.customerData['old_password'] = currentPassword;
            this.customerData['password'] = undefined;
        } else {
            this.customerData.change_password = '0';
        }

        this.requestCustomerAction();
    }

    requestCustomerAction() {
        Connection.restData();
        Connection.setBodyData(this.customerData);
        Connection.connect(customers, this, this.isEditProfile ? 'PUT' : 'POST');
        this.props.storeData('showLoading', { type: 'dialog' });
    }

    setData(data) {
        if (this.isEditProfile) {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: data.customer }
            ]);
        } else {
            this.props.storeData('showLoading', { type: 'none' });
        }
        if (data.message !== undefined) {
            let messages = data.message;
            if (messages.length > 0) {
                let message = messages[0];
                setTimeout(() => {
                    Alert.alert(
                        '',
                        message,
                        [
                            {
                                text: Identify.__('OK'), onPress: () => {
                                    if (this.isEditProfile) {
                                        this.props.navigation.goBack(null);
                                    } else {
                                        NavigationManager.openRootPage(this.props.navigation, 'Login', {
                                            email: this.customerData.email,
                                            password: this.customerData.password
                                        });
                                    }
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                }, 300);
                return;
            }
        } else {
            NavigationManager.backToPreviousPage(this.props.navigation);
        }
    }

    updateButtonStatus(status) {
        if (status != this.state.enableButton) {
            this.setState({ enableButton: status });
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_customer_form':
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
            <Container style={{backgroundColor: variable.appBackground}}>
                <Content>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 30, paddingBottom: 70 }}>
                        {this.renderLayoutFromConfig('customer_layout', 'content')}
                    </View>
                </Content>
                {this.renderLayoutFromConfig('customer_layout', 'container')}
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);