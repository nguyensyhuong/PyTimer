import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from '../../core/base/components/SimiComponent';
import {LoginButton, LoginManager, AccessToken, GraphRequestManager, GraphRequest} from 'react-native-fbsdk';
import { quoteitems, address_book_mode } from '../../core/helper/constants';
import Connection from '../../core/base/network/Connection';
import AppStorage from '../../core/helper/storage';
import md5 from 'md5';
import NavigationManager from '../../core/helper/NavigationManager';
import simicart from '../../core/helper/simicart';

class AddFBLogin extends SimiComponent {
    constructor(props) {
        super(props);
        this.shouldGetQuoteItems = false;
        this.customerData = null;
        this.email = '';
        this.password = '';
        LoginManager.logOut()
    }
    setData(data) {
        console.log(JSON.stringify(data));
        this.props.clearData();
        if (!this.shouldGetQuoteItems) {
            this.customerData = data;
            this.saveCustomerData();
            this.shouldGetQuoteItems = true;
            this.getQuoteItems();
        } else {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'customer_data', data: this.customerData },
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
            Connection.setCustomer({ email: this.email, password: this.password });
            AppStorage.saveCustomerAutoLoginInfo({ email: this.email, password: this.password });
        } catch (error) {
            // Error saving data
        }
    }
    navigate = () => {
        this.props.navigation.goBack(null);
        if (this.props.isCheckout) {
            NavigationManager.openPage(this.props.navigation, 'AddressBook', {
                isCheckout: true,
                mode: address_book_mode.checkout.select
            });
        }
    }
    facebookLoginCallback(error: ?Object, result: ?Object) {
        console.log(parent);
        if (error) {
            console.log('Error fetching data: ' + JSON.stringify(error.toString()));
        } else {
            console.log('Success fetching data: ' + JSON.stringify(result));

            // let names = result.name.split(' ');

            // let params = [];
            // params['email'] = result.email;
            // params['password'] = md5(simicart.merchant_authorization + result.email);
            // params['firstname'] = encodeURI(names[0]);
            // params['lastname'] = encodeURI(names[1]);
            // this.requestSocialLogin(params);
        }
    }
    requestSocialLogin(params) {
        Connection.restData();
        Connection.setGetData(params);
        Connection.connect('simiconnector/rest/v2/customers/sociallogin', this, 'GET');
    }
    renderPhoneLayout() {
        const that = this;
        return (
            <LoginButton
                style={{width: '100%', marginTop: 17, height: 38, flex: 1, justifyContent: 'center'}}
                readPermissions={['email','user_photos','user_birthday']}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            console.log("Request login has error: " + result.error);
                        } else if (result.isCancelled) {
                            console.log("Request login is cancelled.");
                        } else {
                            console.log('Login Success: ' + JSON.stringify(result));
                            AccessToken.getCurrentAccessToken().then(
                                (data) => {
                                    console.log(data.accessToken.toString());

                                    const callback = (error: ?Object, result: ?Object) => {
                                        if (error) {
                                            console.log('Error fetching data: ' + JSON.stringify(error.toString()));
                                        } else {
                                            console.log('Success fetching data: ' + JSON.stringify(result));
                                        }

                                        let names = result.name.split(' ');

                                        that.email = result.email;
                                        that.password = md5(simicart.merchant_authorization + result.email);

                                        let params = [];
                                        params['email'] = that.email;
                                        params['password'] = that.password;
                                        params['firstname'] = encodeURI(names[0]);
                                        params['lastname'] = encodeURI(names[1]);
                                        Connection.restData();
                                        Connection.setGetData(params);
                                        Connection.connect('simiconnector/rest/v2/customers/sociallogin', that, 'GET');
                                        
                                        that.props.storeData('showLoading', { type: 'dialog' });
                                    };

                                    const infoRequest = new GraphRequest(
                                        '/me?fields=id,name,email,gender,birthday&access_token=' + data.accessToken.toString(),
                                        null,
                                        callback
                                    );
                                    // Start the graph request.
                                    new GraphRequestManager().addRequest(infoRequest).start();
                                }
                            );
                        }
                    }
                }
                onLogoutFinished={() => console.log("logout.")} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AddFBLogin);