import React from 'react';
import { connect } from 'react-redux';
import Connection from '@base/network/Connection';
import { storeviews, devices, quoteitems, customer_login } from '@helper/constants';
import Identify from '@helper/Identify';
import { NativeModules, Platform } from 'react-native';
import AppStorage from '@helper/storage';
import firebase from 'react-native-firebase';

const nativeMethod = Platform.OS === 'ios' ? null : NativeModules.NativeMethodModule;

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        Connection.restData();
        let api = storeviews;
        AppStorage.getData('store_id').then((storeID) => {
            if (storeID) {
                api = api + '/' + storeID;
            } else {
                api = api + '/default';
            }

            AppStorage.getData('currency_code').then((currencyCode) => {
                if (currencyCode) {
                    let params = {
                        currency: currencyCode
                    };
                    Connection.setGetData(params);
                }
                Connection.connect(api, this, 'GET');
            });
        });
    }
    setData(data) {
        if (data.hasOwnProperty('storeview')) {
            this.storeViewData = data;
            if (data.storeview.hasOwnProperty('base') && data.storeview.base.hasOwnProperty('locale_identifier')) {
                Identify.locale_identifier = data.storeview.base.locale_identifier;
            }
            Connection.setMerchantConfig(data)
            // this.props.storeData(data);

            AppStorage.saveData('store_id', data.storeview.base.store_id);
            AppStorage.saveData('currency_code', data.storeview.base.currency_code);

            if (Platform.OS !== 'ios' && data.storeview.base.android_sender) {
                this.registerToken(data.storeview.base.android_sender);
            }
            this.autoLogin();
        } else if (data.hasOwnProperty('customer')) {
            Connection.setCustomer({ email: this.email, password: this.password });
            this.customer = data.customer;
            this.props.storeData('actions', [
                { type: 'customer_data', data: this.customer },
                { type: 'merchant_configs', data: this.storeViewData }
            ]);
            this.getQuoteItems();
        } else if (data.hasOwnProperty('quoteitems')) {
            this.props.storeData('quoteitems', data);
        } else {
            AppStorage.saveData('notification_token', data.device.device_token);
        }
    }
    registerToken(senderID) {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.requestRegisterDevice(senderID);
                } else {
                    // user doesn't have permission
                    firebase.messaging().requestPermission()
                        .then(() => {
                            this.requestRegisterDevice(senderID);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
    }

    autoLogin() {
        AppStorage.getCustomerAutoLoginInfo().then((customerInfo) => {
            if (customerInfo !== null) {
                if (customerInfo.email !== undefined) {
                    this.email = customerInfo.email;
                }
                if (customerInfo.password !== undefined) {
                    this.password = customerInfo.password;
                }
                if (this.email !== '' && this.password !== '') {
                    try {
                        Connection.setCustomer(null);
                        Connection.restData();
                        let params = [];
                        params['email'] = this.email;
                        params['password'] = this.password;
                        Connection.setGetData(params);
                        Connection.connect(customer_login, this, 'GET', false);
                    } catch (e) {
                        console.log(e.message);
                    }
                } else {
                    this.props.storeData('merchant_configs', this.storeViewData);
                }
            } else {
                this.props.storeData('merchant_configs', this.storeViewData);
            }
            //this callback is executed when your Promise is resolved
        }).catch((error) => {
            //this callback is executed when your Promise is rejected
            console.log('Promise is rejected with error: ' + error);
            this.props.storeData('merchant_configs', this.storeViewData);
        });
    }

    getQuoteItems() {
        Connection.restData();
        Connection.connect(quoteitems, this, 'GET');
    }

    async requestRegisterDevice(senderID) {
        if (Platform.OS !== 'ios') {
            let token = await nativeMethod.createNotificationToken(senderID);

            AppStorage.getData('notification_token').then((savedToken) => {
                if (!savedToken || (savedToken && token !== savedToken)) {
                    Connection.restData();
                    Connection.setBodyData({
                        device_token: token,
                        is_demo: '1',
                        plaform_id: Platform.OS === 'ios' ? '1' : '3',
                        app_id: 'com.simicart',
                        build_version: '1'
                    });
                    Connection.connect(devices, this, 'POST');
                }
            });
        }
    }
    render() {
        return (null);
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

// export default Settings;
