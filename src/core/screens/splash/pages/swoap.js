import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import AppStorage from '@helper/storage';
import Connection from '@base/network/Connection';
import SprinnerApp from '@base/components/spinner';
import { NetworkApp } from "@base/components/layout/config";
import { customer_login, quoteitems } from "@helper/constants";
import Identify from '@helper/Identify';
import Redirect from './redirect';
import Events from '@helper/config/events';

class Swoap extends React.Component {
    constructor(props, context) {
        super(props);
        let customerInfo = null;
        if (!Identify.isEmpty(this.props.data)) {
            if (this.props.data !== undefined) {
                customerInfo = this.props.data;
            }
        }
        this.state = { customer: customerInfo };
        this.email = '';
        this.password = '';
        this.isGetQuote = false;
    }

    autoLogin(email, password) {
        try {
            Connection.setCustomer(null);
            Connection.restData();
            let params = [];
            params['email'] = email;
            params['password'] = password;
            Connection.setGetData(params);
            Connection.connect(customer_login, this, 'GET', false);
        } catch (e) {
            console.log(e.message);
        }
    }

    getQuoteItems() {
        this.isGetQuote = true;
        Connection.restData();
        Connection.connect(quoteitems, this, 'GET');
    }

    setData(data) {
        Events.dispatchEventData(data);
        if (this.isGetQuote) {
            this.props.storeData('actions', [
                { type: 'customer_data', data: this.state.customer },
                { type: 'quoteitems', data: data }
            ]);
        } else {
            Connection.setCustomer({ email: this.email, password: this.password });
            this.state.customer = data.customer;
            this.getQuoteItems();
        }
    }

    handleWhenRequestFail() {
        this.setState({ customer: true });
    }

    render() {
        if (this.state.customer == null) {
            AppStorage.getCustomerAutoLoginInfo().then((customerInfo) => {
                if (customerInfo !== null) {
                    if (customerInfo.email !== undefined) {
                        this.email = customerInfo.email;
                    }
                    if (customerInfo.password !== undefined) {
                        this.password = customerInfo.password;
                    }
                    if (this.email !== '' && this.password !== '') {
                        this.autoLogin(this.email, this.password);
                    } else {
                        this.setState({ customer: true });
                    }
                } else {
                    //login without customer.
                    this.setState({ customer: true });
                }
                //this callback is executed when your Promise is resolved
            }).catch((error) => {
                //this callback is executed when your Promise is rejected
                console.log('Promise is rejected with error: ' + error);
            });
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <SprinnerApp />
                    <NetworkApp />
                </View>
            );
        } else {
            return <Redirect navigation={this.props.navigation} />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(Swoap);
