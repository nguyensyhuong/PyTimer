import React from 'react';
import {Text, Button, View, Input, Item , Toast} from 'native-base';
import Identify from '@helper/Identify';
import Connection from '../../core/base/network/Connection';
import Events from '../../core/helper/config/events';
import { quoteitems } from '@helper/constants';
import {connect} from 'react-redux'
class Coupon extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            coupon : ''
        }
        this.parent = this.props.parent
    }
    setData(data){
        this.props.storeData('showLoading',{type: 'none'});
        if(data.errors){
            let text = data.error[0].message;
            Toast.show({text: text})
        }else {
            this.parent.setData(data)
        }
    }
    couponChange(code) {
        this.setState({coupon: code})
    }
    tracking(){
        let data = {};
        data['event'] = 'cart_action';
        data['action'] = 'apply_coupon_code';
        data['coupon_code'] = this.state.coupon;
        Events.dispatchEventAction(data, this);
    }
    couponHandle() {
        if(this.state.coupon == ''){
            Toast.show({text: 'Please re-enter your code!!'})
        }else {
            this.tracking()
            this.props.storeData('showLoading', { type: 'dialog' });
            Connection.restData();
            if (!Identify.isEmpty(this.parent.props.data) && this.parent.props.data.quote_id != null) {
                let params = [];
                params['quote_id'] = this.parent.props.data.quote_id;
                Connection.setGetData(params);
            }
            let json = {};
            json['coupon_code'] = this.state.coupon;
            Connection.setBodyData(json);
            Connection.connect(quoteitems, this, 'PUT');
        }
    }
    render(){
        return (
            <View style={{ flex: 3, flexDirection: 'row', marginTop: 20, marginLeft: 15, marginRight: 10 }}>
                <Item regular style={{ flex: 2, marginRight: 20, height: 45, borderColor: '#dedede', backgroundColor: '#dedede' }}>
                    <Input style={{paddingStart: 10}} placeholder={Identify.__('Enter a coupon code')} value={this.state.coupon} onChangeText={(code) => { this.couponChange( code ) }} />
                </Item>
                <Button primary onPress={() => { this.couponHandle() }}><Text style={{ textAlign: 'center' }}>{Identify.__('Apply')}</Text></Button>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return { loading: state.redux_data.showLoading };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Coupon);
