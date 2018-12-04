import { connect } from 'react-redux';
import WebViewPayment from '../../braintree/WebViewPayment';
import Connection from '../../../core/base/network/Connection';
import NavigationManager from '../../../core/helper/NavigationManager';
import {pp_webview} from '../../constants'
class PaypalExpressWebViewModule extends WebViewPayment {

    constructor(props) {
        super(props);
        this.orderInfo = this.props.navigation.getParam('orderInfo');
        this.state = {
            url: this.props.navigation.getParam('url') ? this.props.navigation.getParam('url') : '',
            reviewAddress: this.props.navigation.getParam('review_address') ? this.props.navigation.getParam('review_address') : ''
        };
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none' && this.state.url === '') {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (this.state.url === '') {
            Connection.restData();
            Connection.connect(pp_webview, this, 'GET');
        }
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        if(data && data.ppexpressapi) {
            this.setState({
                url: data.ppexpressapi.url,
                reviewAddress: data.ppexpressapi.review_address
            });
        }
    }

    onSuccess() {
        if(this.state.reviewAddress == '1') {
            NavigationManager.openRootPage(this.props.navigation, 'PayPalExpressAddress');
        } else {
            NavigationManager.openRootPage(this.props.navigation, '');
        }
        return true;
    }

    addMorePropsToWebView() {
        let orderID = this.orderInfo ? this.orderInfo.invoice_number : null;
        return({
            url: this.state.url,
            orderID: orderID,
            keySuccess: 'simiconnector/rest/v2/ppexpressapis/return',
        });
    }

    render() {
        if(this.state.url === '') {
            return(null);
        } else {
            return(super.render());
        }
    }

}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressWebViewModule);