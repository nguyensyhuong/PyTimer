import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Text, Toast, Content, Container, View, Button, Icon} from 'native-base';
import {Alert, TouchableOpacity} from 'react-native'
import {my_giftcard} from '../constants';
import {connect} from 'react-redux';
import Connection from '../../core/base/network/Connection';
import Identify from "../../core/helper/Identify";
import NavigationManager from '../../core/helper/NavigationManager';
import helperGiftCard from "./helper";

class MyGiftCard extends SimiPageComponent{
    constructor(props){
        super(props);
        this.isBack = true;
        this.state = {
            ...this.state,
            data: null
        }
    }

    componentWillMount(){
        if(this.props.data.showLoading.type === 'none' && !this.state.data){
            this.props.storeData('showLoading', {type: 'full'})
        }
    }

    componentDidMount(){
        this.props.navigation.addListener(
            'didFocus',
            () => {
                this.forceUpdate();
                Connection.restData();
                Connection.connect(my_giftcard, this, 'GET')
            }
        );
    }

    setData(data){
        if (data.errors) {
            let errors = data.errors;
            let text = "";
            for (let i in errors) {
                let error = errors[i];
                text += error.message + ' ';
            }
            if (text === "") {
                text = Identify.__('Something went wrong')
            }
            Toast.show({text: text})
        } else {
            this.setState({data : data});
            this.props.storeData('showLoading', {type: 'none'})
        }
    }

    renderGiftCardInfor = (data) => {
        return (
            <View style={{paddingStart: 12, paddingEnd: 12, paddingTop: 12}}>
                <Text style={{fontSize: 20}}>My credit balance : {data.currency_symbol}{data.balance}</Text>
            </View>
        )
    }

    renderButton = (data) => {
        return(
            <View style={{flex: 1, flexDirection: 'row', padding: 12}}>
                <View>
                    <Button
                        style={{justifyContent: 'center'}}
                        title={Identify.__('View Detail')}
                        onPress={() => NavigationManager.openPage(this.props.navigation, 'MyGiftCardDetail', {
                            data: data
                        })}
                    >
                        <Text style={{fontSize: 12}}>{Identify.__('View Detail')}</Text>
                    </Button>
                </View>
                <View style={{flexGrow: 2, marginStart: 10}}>
                    <Button
                        style={{width: '100%', justifyContent: 'center'}}
                        title={Identify.__('Add/Redeem A Gift Card')}
                        onPress={() => NavigationManager.openPage(this.props.navigation, 'AddRedeemGiftCard')}
                    >
                        <Text style={{fontSize: 12}}>{Identify.__('Add/Redeem A Gift Card')}</Text>
                    </Button>
                </View>
            </View>
        )
    }

    handleDeleteGiftCode = (id) => {
        Alert.alert(
            Identify.__('Confirmation'),
            Identify.__('Are you sure you want to remove this gift code from your list?'),
            [
                { text: 'NO', onPress: () => { }, style: 'cancel' },
                {
                    text: 'YES', onPress: () => {
                    this.props.storeData('showLoading', { type: 'dialog' });
                    this.state.data = null;
                    Connection.restData();
                    Connection.connect(my_giftcard + '/' + id, this, 'DELETE');
                }
                },
            ],
            { cancelable: false }
        )
    }
    codeItemOnPress(item){
        NavigationManager.openPage(this.props.navigation, 'MyGiftCardItemDetail', {
            giftvoucher_id: item.giftvoucher_id,
            customer_voucher_id: item.customer_voucher_id
        })
    }
    renderListCodeLayout(item){
        return (
            <TouchableOpacity
                icon key={Identify.makeid()}
                style={{padding: 12, position: 'relative', borderBottomWidth: 0.3, borderColor: '#c9c9c9'}}
                onPress={() => this.codeItemOnPress(item)}
            >
                {helperGiftCard.renderListCodeLayoutItem(item.gift_code, Identify.__('Gift Card Code'), true)}
                {helperGiftCard.renderListCodeLayoutItem(Identify.formatPrice(item.balance), Identify.__('Balance'))}
                {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.checkStatus(item.status), Identify.__('Status'))}
                {helperGiftCard.renderListCodeLayoutItem(item.added_date, Identify.__('Added Date'))}
                {helperGiftCard.renderListCodeLayoutItem(item.expired_at, Identify.__('Expired Date'))}
                <Icon
                    active
                    name='ios-close'
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 12
                    }}
                    onPress={() => this.handleDeleteGiftCode(item.customer_voucher_id)}
                />
            </TouchableOpacity>
        )
    }
    renderListCode = (data) => {
        if(data.length > 0){
            let Listcode = data.map((item) => {
                return this.renderListCodeLayout(item)
            })
            return (
                <View>
                    {Listcode}
                </View>
            );
        }else {
            return (
                <View>
                    <Text>{Identify.__('Your list gift code is empty !')}</Text>
                </View>
            )
        }
    }

    renderView(){
        let data = this.state.data.simicustomercredit;
        return(
            <View>
                <View style={{
                    borderBottomWidth: 0.3,
                    borderColor: '#c9c9c9'
                }}>
                    {this.renderGiftCardInfor(data)}
                    {this.renderButton(data)}
                </View>
                <View>
                    {this.renderListCode(data.listcode)}
                </View>
            </View>
        )
    }

    createLayout(){
        if(this.state.data){
            return(
                <Container>
                    <Content>
                        {this.renderView()}
                    </Content>
                </Container>
            )
        }
        return null;
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
export default connect(mapStateToProps, mapDispatchToProps)(MyGiftCard);