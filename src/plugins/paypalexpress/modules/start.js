import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from '../../../core/base/components/SimiComponent';
import { TouchableOpacity, Image } from 'react-native';
import Connection from '../../../core/base/network/Connection';
import NavigationManager from '../../../core/helper/NavigationManager';
import { quoteitems } from '../../../core/helper/constants';

class PaypalExpressStart extends SimiComponent {

    constructor(props) {
        super(props);
    }

    setData(data) {
        this.props.storeData('showLoading', { type: 'none' });
        NavigationManager.openRootPage(this.props.navigation, 'PaypalExpressWebView', {});
    }

    onAddProductToCart() {
        this.isAddToCart = true;
        let params = {};
        if (this.props.product.has_options == '1') {
            let optionParams = this.props.obj.getOptionParams();
            if (optionParams != null) {
                params = {
                    ...optionParams,
                };
            } else {
                return;
            }
        }
        params['product'] = this.props.product.entity_id;
        params['qty'] = '1';

        this.props.storeData('showLoading', { type: 'dialog' });

        Connection.restData();
        Connection.setBodyData(params);
        Connection.connect(quoteitems, this, 'POST');
    }

    renderPhoneLayout() {
        let isFromProduct = false;
        if(this.props.product) {
            isFromProduct = true;
        }
        return(
            <TouchableOpacity style={isFromProduct ? {flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 10} : {flex: 1}} onPress={() => {
                if (isFromProduct) {
                    this.onAddProductToCart();
                } else {
                    NavigationManager.openRootPage(this.props.navigation, 'PaypalExpressWebView', {});
                }
            }}>
                <Image source={require('../../../../media/background_paypalexpress.png')}
                    style={{ width: '100%', height: 50, resizeMode: "stretch" }} />
            </TouchableOpacity>
        );
    }

}

const mapStateToProps = (state) => {
    return { data: state.redux_data.quoteitems };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaypalExpressStart);