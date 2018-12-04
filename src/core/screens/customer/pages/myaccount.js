import React from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import Connection from '@base/network/Connection';
import NavigationManager from '@helper/NavigationManager';
import AppStorage from '@helper/storage';
import { customer_logout, address_book_mode } from '@helper/constants';
import SimiPageComponent from '@base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class MyAccountPage extends SimiPageComponent {

    logout() {
        try {
            this.props.storeData('showLoading', { type: 'dialog' });
            Connection.restData();
            Connection.connect(customer_logout, this, 'GET');
        } catch (e) {
            console.log(e.message);
        }
    }

    setData(data) {
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'clear_all_data', data: null },
        ]);
        Connection.setCustomer(null);
        AppStorage.removeAutologinInfo();
        this.props.navigation.goBack(null);
    }

    onSelectMenuItem(keyItem) {
        switch (keyItem) {
            case 'myaccount_logout':
                this.logout();
                break;
            case 'myaccount_address':
                NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                    mode: address_book_mode.normal
                });
                break;
            case 'myaccount_orders':
                NavigationManager.openPage(this.props.navigation, 'OrderHistory');
                break;
            case 'myaccount_profile':
                NavigationManager.openPage(this.props.navigation, 'Customer', {
                    isEditProfile: true
                });
                break;
            case 'my_rewardpoint':
                NavigationManager.openPage(this.props.navigation, 'MyReward');
                break;
            default:
                return false;
        }
        return true;
    }

    renderPhoneLayout() {
        return (
            <Container style={{ paddingLeft: 15, paddingRight: 15, backgroundColor: variable.appBackground }}>
                <Content style={{ flex: 1, paddingTop: 15 }}>
                    {this.renderLayoutFromConfig('myaccount_layout', 'content')}
                </Content>
                {this.renderLayoutFromConfig('myaccount_layout', 'container')}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountPage);