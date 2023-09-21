import React from 'react';
import { Text, Icon, Toast } from 'native-base';
import { TouchableOpacity, View, findNodeHandle, Platform, Alert } from 'react-native';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import SimiComponent from '@base/components/SimiComponent';
import Events from '@helper/config/events';
import NavigationManager from '@helper/NavigationManager';
import WebView from 'react-native-webview';
import AppStorage from '@helper/storage';

class PaymentMethod extends SimiComponent {

    constructor(props) {
        super(props);
        this.selectedPayment = null;
        this.count = 1;
        this.url_iframe_test = '';
    }

    webView = {
        canGoBack: false,
        ref: null,
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    
    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    scrollToPayment() {
        this.view.measureLayout(
            findNodeHandle(this.props.parent.scrollViewRef),
            (x, y) => {
                this.props.parent.scrollViewRef.scrollTo({ x: 0, y: y, animated: true });
            }
        );
    }

    tracking() {
        let data = {};
        data['event'] = 'checkout_action';
        data['action'] = 'saved_payment_method';
        Events.dispatchEventAction(data, this);
    }

    onSelectPayment(paymentMethod, data) {
        console.log('aaaa', paymentMethod)
        this.tracking();
        this.props.parent.onSaveMethod({
            p_method: {
                ...data,
                method: paymentMethod.payment_method
            }
        });
    }

    openCreditCardPage(paymentMethod) {
        NavigationManager.openPage(this.props.navigation, 'CreditCard', {
            payment: paymentMethod,
            billingAddress: this.props.parent.billingAddressParams,
            shippingAddress: this.props.parent.shippingAddressParams
        });
    }

    renderCreditCard(paymentMethod) {
        let creditCardNumber = null;
        if (Identify.getCreditCardData()) {
            let savedNumber = Identify.getCreditCardData().cc_number;
            creditCardNumber = savedNumber.substr(savedNumber.length - 4);
            creditCardNumber = '**** ' + creditCardNumber;
        }
        return (
            <TouchableOpacity key={paymentMethod.payment_method} onPress={() => {
                if (Identify.getCreditCardData()) {
                    this.onSelectPayment(paymentMethod, Identify.getCreditCardData())
                } else {
                    this.openCreditCardPage(paymentMethod)
                }
            }}>
                <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                    <Icon name={paymentMethod.p_method_selected ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off'} />
                    <View style={{ marginLeft: 10, marginRight: 30 }}>
                        <Text>{Identify.__(paymentMethod.title)}</Text>
                        {creditCardNumber && <Text style={{ fontSize: material.textSizeTiny }}>{creditCardNumber}</Text>}
                    </View>
                    <Icon
                        name='md-create'
                        style={{ fontSize: 20, position: 'absolute', right: 0, marginRight: 10, padding: 5 }}
                        onPress={() => {
                            this.openCreditCardPage(paymentMethod)
                        }} />
                </View>
            </TouchableOpacity>
        );
    }

    renderPaymentItem(paymentMethod) {
        // console.log('ầdffs', paymentMethod)
        if (paymentMethod.show_type == '1') {
            return (this.renderCreditCard(paymentMethod));
        }
        let showContent = (paymentMethod.hasOwnProperty('content') && paymentMethod.content && paymentMethod.p_method_selected) ? true : false;
        return (
            <View>
                <TouchableOpacity key={paymentMethod.payment_method}>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        if(!this.props.parent.state.iframe_order) { 
                            this.onSelectPayment(paymentMethod)
                        }
                    }}>
                        <View style={{ borderBottomWidth: 0.5, borderBottomColor: '#EDEDED', flex: 1, flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}>
                            <Icon name={paymentMethod.p_method_selected ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off'} />
                            <View style={{ marginLeft: 10 }}>
                                <Text>{Identify.__(paymentMethod.title)}</Text>
                                {showContent && <Text style={{ fontSize: material.textSizeTiny }}>{paymentMethod.content}</Text>}
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
                {paymentMethod.payment_method == 'WINDCAVE_PXPAY2_IFRAME' && this.props.parent.state.iframe_order && this.props.parent.state.iframe_url && 
                    <View style={{zIndex: 9999, activeOpacity: 0.99, height: Platform.OS == 'ios' ? 850 : 1100}}>
                        <WebView 
                            source={{uri: this.props.parent.state.iframe_url}} 
                            style={{flex: 1, activeOpacity: 0.99, overflow: 'hidden'}}
                            startInLoadingState={true}
                            javaScriptEnabled={true}
                            androidHardwareAccelerationDisabled
                            androidLayerType={'hardware'}
                            ref={(webView) => { this.webView.ref = webView; }}
                            autoFocus={true}
                            onNavigationStateChange={(webViewState) => {
                                console.log('sssđf', webViewState)
                                if(webViewState.url && webViewState.url.includes('https://sec.windcave.com')) {
                                    this.count = this.count + 1;
                                }
                                if(webViewState.url && webViewState.url.includes('pxpay2/pxpay2iframe/redirectback')) {
                                    this.webView.ref.stopLoading();
                                    if(this.count > 7 || (this.count > 2 && webViewState.navigationType != 'formsubmit')) {
                                        this.props.parent.setState({iframe_order: false});
                                        this.props.parent.onPlaceOrderAfterPayIframe();
                                    } else {
                                        Toast.show({
                                            text: 'Payment failed',
                                            type: 'danger',
                                            duration: 3000, textStyle: { fontFamily: material.fontFamily }
                                        });
                                        NavigationManager.clearStackAndOpenPage(this.props.navigation, 'Cart')
                                    }
                                }
                            }}
                        />
                    </View>}
            </View>
        )
    }

    createItems() {
        let items = [];
        let data = this.props.parent.props.data.order.payment
        for (let i in data) {
            let paymentMethod = data[i];
            if (paymentMethod.p_method_selected) {
                this.props.parent.selectedPayment = paymentMethod;
            }
            items.push(
                this.renderPaymentItem(paymentMethod)
            );
        }
        return items;
    }

    renderPhoneLayout() {
        return (
            <View ref={ref => this.view = ref}>
                <Text style={{ fontFamily: material.fontBold, flex: 1, backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__(this.props.title)}</Text>
                {this.createItems()}
            </View>
        );
    }
}

export default PaymentMethod;
