import React from 'react';
import { Container, Toast } from 'native-base';
import { WebView, BackHandler, Alert } from 'react-native';
import { order_history } from '../../../helper/constants';
import Connection from '../../network/Connection';
import Identify from '../../../helper/Identify';
import { connect } from 'react-redux';

class WebViewPayment extends React.Component {

    constructor(props) {
        super(props);
    }

    webView = {
        canGoBack: false,
        ref: null,
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        Toast.show({
            text: Identify.__('Your order has been canceled'),
            type: 'success',
            buttonText: "Okay",
            duration: 3000
        });
        this.props.navigation.goBack(null);
    }

    onBackPress = () => {
        if (this.webView.canGoBack && this.webView.ref) {
            this.webView.ref.goBack();
        } else {
            Alert.alert(
                'Warning',
                'Are you sure you want to cancel this order?',
                [
                    { text: 'Cancel', onPress: () => {style: 'cancel'} },
                    {
                        text: 'OK', onPress: () => {
                            if (this.props.orderID) {
                                this.cancelOrder();
                            } else {
                                this.props.navigation.goBack(null);
                            }
                        }
                    },
                ],
                { cancelable: true }
            );
        }
        return true;
    }

    cancelOrder() {
        this.props.storeData('showLoading', { type: 'dialog' });
        Connection.restData();
        Connection.setBodyData({ status: 'cancel' });
        Connection.connect(order_history + '/' + this.props.orderID, this, 'PUT');
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    navigateResults(message, type) {
        if (message) {
            Toast.show({
                text: message,
                type: type,
                buttonText: "Okay",
                duration: 3000
            });
        }
        this.props.navigation.goBack(null);
    }

    processUrl(url) {
        if (this.props.keySuccess && url.includes(this.props.keySuccess)) {
            console.log('onSuccess');
            if(!this.props.parent.onSuccess()) {
                this.navigateResults(this.props.messageSuccess, 'success');
            } else {
                this.webView.ref.stopLoading();
            }
        } else if (this.props.keyFail && url.includes(this.props.keyFail)) {
            console.log('onFail');
            if(!this.props.parent.onFail()) {
                this.navigateResults(this.props.messageFail, 'warning');
            } else {
                this.webView.ref.stopLoading();
            }
        } else if (this.props.keyError && url.includes(this.props.keyError)) {
            console.log('onError');
            if(!this.props.parent.onError()) {
                this.navigateResults(this.props.messageError, 'danger');
            } else {
                this.webView.ref.stopLoading();
            }
        } else if (this.props.keyReview && url.includes(this.props.keyReview)) {
            console.log('onReview');
            if(!this.props.parent.onReview()) {
                this.navigateResults(this.props.messageReview, '');
            } else {
                this.webView.ref.stopLoading();
            }
        }
    }

    _onNavigationStateChange(webViewState) {
        this.webView.canGoBack = webViewState.canGoBack;
        let url = webViewState.url;
        console.log(url);
        if (this.props.parent) {
            this.processUrl(url);
        }
    }

    render() {
        return (
            <Container>
                <WebView
                    originWhitelist={['*']}
                    source={{ uri: this.props.url }}
                    style={{ flex: 1 }}
                    startInLoadingState={true}
                    ref={(webView) => { this.webView.ref = webView; }}
                    onNavigationStateChange={this._onNavigationStateChange.bind(this)} />
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(null, mapDispatchToProps)(WebViewPayment);
