import React from 'react';
import { connect } from 'react-redux';
import SimiComponent from "../../core/base/components/SimiComponent";
import QRCodeScanner from 'react-native-qrcode-scanner';
import Connection from '../../core/base/network/Connection';
import NavigationManager from '../../core/helper/NavigationManager';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Toast} from 'native-base'
import {barcode} from '../constants'
class QrBarCode extends SimiPageComponent {
    constructor(props){
        super(props);
        this.isBack = true;
        this.readed = false;
    }

    componentDidMount() {
        this.props.navigation.addListener(
            'didFocus',
            () => {
                this.forceUpdate();
                this.scanner.reactivate()
            }
        );
    }

    setData(data) {
        this.props.storeData({ type: 'none' });
        this.readed = false;
        if(data.error){
            this.scanner.reactivate();
            Toast.show({text: data.error[0].message})
        } else {
            let productID = data.simibarcode.product_entity_id;
            NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                productId: productID
            });
        }

    }

    onSuccess(result) {
        if(result && result.data) {
            if(this.readed === false){
                this.readed = true;
                let code = result.data;
                Connection.restData();
                Connection.setGetData({
                    type: code.includes('QR') ? '1' : '0'
                });
                Connection.connect(barcode + '/' + code, this, 'GET');
                this.props.storeData({ type: 'dialog' });
            }

        }
    }

    renderPhoneLayout() {
        return (
            <QRCodeScanner
                onRead={this.onSuccess.bind(this)}
                ref={(node) => { this.scanner = node }}
                showMarker={true}
            />
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({ type: 'showLoading', data: data })
        }
    };
};
export default connect(null, mapDispatchToProps)(QrBarCode);