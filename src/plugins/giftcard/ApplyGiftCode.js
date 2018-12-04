import React from 'react';
import SimiComponent from "../../core/base/components/SimiComponent";
import {Text, CheckBox, ListItem, Body, Input, Button, Toast, Icon,  Label, Item, Picker} from 'native-base';
import { View, StyleSheet, Modal} from 'react-native';
import Identify from "../../core/helper/Identify";
import {connect} from 'react-redux';
import Connection from '../../core/base/network/Connection';
import {checkout_usecredit, checkout_usecode, checkout_removecode, checkout_changeamount , cart_usecredit, cart_usecode, cart_removecode, cart_changeamount } from '../constants';

const styles = StyleSheet.create({
    item: {
        marginLeft: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        flex: 1,
        height: 40,
        marginTop: 30
    }
});
class ApplyGiftCode extends SimiComponent{
    constructor(props){
        super(props)
        this.parent = this.props.parent;
        let use_credit = false;
        let use_giftcode = false;
        this.giftcode_used = null;
        this.amount = '';
        this.giftcode = '';
        this.data = this.props.api_config === 1 ? this.parent.props.data : this.parent.props.data.order;
        if(this.data.hasOwnProperty('gift_card')){
            if(this.data.gift_card.hasOwnProperty('credit')){
                use_credit = this.data.gift_card.credit.use_credit === 1;
                this.amount = this.data.gift_card.credit.use_credit_amount;
            }
            if(this.data.gift_card.hasOwnProperty('giftcode')){
                this.giftcode_used = this.data.gift_card.giftcode;
                use_giftcode = this.data.gift_card.giftcode.use_giftcode === 1;
            }
        }
        this.state = {
            use_credit : use_credit,
            use_giftcode : use_giftcode,
            existed_giftcode : '',
            amount : this.amount,
            giftcode : this.giftcode,
            use_listcode : false,
            openDialog: false,
            amount_change: '',
            dataDialog : {}
        };
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
    handleWhenRequestFail(){
        this.props.storeData('showLoading',{type: 'none'});
    }
    updateCheck(type = 1) {
        if(type === 1){
            this.setState((oldState) => {
                return {
                    use_credit: !oldState.use_credit,
                };
            });
            if(this.state.use_credit){
                this.handleUseCredit(0);
            }
        }else if(type === 2) {
            this.setState((oldState) => {
                return {
                    use_giftcode: !oldState.use_giftcode,
                };
            });
            if(this.state.use_giftcode){
                this.handleUseGiftCode(0);
                this.setState({dataDialog: {}, openDialog: false, existed_giftcode: ''})
            }
        }
    }

    useCredit(param) {
        let api = this.props.api_config === 1 ? cart_usecredit : checkout_usecredit;
        Connection.setBodyData(param)
        Connection.connect(api, this, 'PUT');
    }
    useCode(param) {
        let api = this.props.api_config === 1 ? cart_usecode : checkout_usecode;
        Connection.setBodyData(param)
        Connection.connect(api, this, 'PUT');
    }
    removeCode(param) {
        let api = this.props.api_config === 1 ? cart_removecode : checkout_removecode;
        Connection.restData();
        Connection.setBodyData(param)
        Connection.connect(api, this, 'PUT');
    }
    changeAmountGiftCodde(param) {
        let api = this.props.api_config === 1 ? cart_changeamount : checkout_changeamount;
        Connection.restData();
        Connection.setBodyData(param)
        Connection.connect(api, this, 'PUT');
    }


    handleUseCredit = (type = 1) => {
        let json = null;
        if(type === 1){
            json = {
                usecredit : 1,
                credit_amount : this.state.amount
            };
        }
        else if(type === 0){
            json = {
                usecredit : 0
            }
        }
        this.props.storeData('showLoading', {type: 'dialog'});
        this.useCredit(json);
    }

    handleUseGiftCode = (type = 1)=>{
        let json = null;
        if(type === 1){
            if (this.state.existed_giftcode === 0 && this.state.giftcode === 0 ){
                Toast.show({test: 'Please enter Gift Code !'});
                return;
            }
            json = {
                giftvoucher : 1
            };
            if (this.state.existed_giftcode !== '')
                json['existed_giftcode'] = this.state.existed_giftcode;
            if (this.state.giftcode !== '')
                json['giftcode'] = this.state.giftcode
        }
        else if(type === 0){
            json = {
                giftvoucher : 0
            }
        }
        this.props.storeData('showLoading', {type: 'dialog'})
        this.useCode(json);
    };

    renderModal(item){
        if(this.state.openDialog){
            return(
                <View
                    style={{
                        padding: 12,
                        borderTopWidth: 0.3,
                        borderBottomWidth: 0.3,
                        borderColor: '#c9c9c9',
                        flex: 1,
                        flexDirection: 'column'
                    }}
                >
                    <Text>Change amount this gift code ({item.hidden_code})</Text>
                    <Input
                        style={{
                            borderBottomWidth: 0.4,
                            borderColor: '#c9c9c9'
                        }}
                        placeholder={item.amount}
                        autoFocus={true}
                        onChangeText={(txt) => { this.onChangeCodeAmount(txt) }}
                    />
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            width: '100%',
                            marginTop: 10
                        }}
                    >
                        <Button
                            style={{flexGrow: 1, height: 40, justifyContent: 'center'}}
                            title={Identify.__('Cancel')} onPress={()=>this.handleCloseDialog()}>
                            <Text>{Identify.__('Cancel')} </Text>
                        </Button>
                        <Button
                            style={{marginStart: 10, flexGrow: 1, height: 40, justifyContent: 'center'}}
                            title={Identify.__('Change')} onPress={()=>this.handleOkChangeAmount(item.gift_code)}>
                            <Text>{Identify.__('Change')}</Text>
                        </Button>
                    </View>
                </View>
            )
        }
    }
    renderListGiftCodeUsedView(item){
        return (
            <View key={Identify.makeid()}>
                <View icon
                      style={{flex: 1, flexDirection: 'row', marginBottom: 10}}
                >
                    <Text
                        onPress={()=>this.handleOpenDialog(item)}>
                        <Icon
                            style={{
                                fontSize: 20,
                                paddingStart: 20
                            }}
                            name='md-create'
                        />
                        {`${item.hidden_code} (${Identify.formatPrice(item.amount)})`}
                    </Text>
                    <Icon
                        style={{fontSize: 20, marginStart: 15}}
                        name='ios-close-circle'
                        onPress={() => this.handleRemoveGiftcode(item.gift_code)}
                    />
                </View>
            </View>
        )
    }
    renderListGiftCodeUsed = () => {
        let giftcode_used = []
        let itemObj = this.props.api_config === 1 ? this.parent.props.data.gift_card.giftcode : this.parent.props.data.order.gift_card.giftcode
        Object.keys(itemObj).map((id) => {
            if(id !== 'use_giftcode'){
                let item = itemObj[id];
                giftcode_used.push(
                    this.renderListGiftCodeUsedView(item)
                )
            }
            return null
        })
        if(this.state.use_giftcode){
            return(
                <View>
                    {giftcode_used}
                </View>
            );
        }
    }

    handleOpenDialog(item){
        this.setState({openDialog: true, dataDialog: item});
    }

    handleCloseDialog(){
        this.setState({openDialog: false});
    }

    handleRemoveGiftcode = (giftcode)=>{
        let json = {
            giftcode
        };
        this.props.storeData('showLoading', {type: 'dialog'});
        this.state.giftcode = '';
        this.removeCode(json);
    };

    handleOkChangeAmount = (giftcode)=>{
        let json = {
            giftcode
        };
        this.state.amount_change ? json['amount'] = this.state.amount_change : json['amount'] = 0;
        this.handleCloseDialog();
        this.props.storeData('showLoading', {type: 'dialog'})
        this.changeAmountGiftCodde(json)
    };

    onChangeTextCredit(txt) {
        this.state.amount = txt;
    }

    onChangeTextCode(txt) {
        this.state.giftcode = txt;
    }

    onValueChange(value) {
        this.setState({existed_giftcode : value})
    }

    onChangeCodeAmount(txt){
        this.state.amount_change = txt;
    }

    renderListCustomerListCode = (customer) => {
        if(customer instanceof Object && customer.hasOwnProperty('list_code') && customer.list_code.length > 0 ){
            let list_code = null;
            if(customer && customer.list_code.length > 0){
                list_code = customer.list_code.map(item => {
                    return(
                        <Picker.Item key={Identify.makeid()} value={item.gift_code} label={`${item.hidden_code} (${item.balance})`}/>
                    )
                });
            }
            return (
                <View>
                    <Item picker style={styles.item} >
                        <Label>{Identify.__('Select from List Code')}</Label>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            selectedValue={this.state.existed_giftcode}
                            onValueChange={this.onValueChange.bind(this)}>
                            {list_code}
                        </Picker>
                    </Item>
                </View>
            )
        }
    }

    renderHeader(){
        return (
            <View
                style={{marginTop: 20, padding: 12, borderTopWidth: 0.3, borderBottomWidth: 0.3, borderColor: '#c9c9c9'}}
            >
                <Text style={{fontWeight: '900'}}>{Identify.__('GIFT CARD')}</Text>
            </View>
        )
    }
    renderUseCreditActionLayout(){
        if(this.state.use_credit){
            return(
                <View
                    style={{
                        padding: 12
                    }}
                >
                    <Text>{Identify.__('Enter Gift Card credit amount to pay for this order')}</Text>
                    <Input
                        style={{backgroundColor: '#d6d6d6', borderColor: '#383838', borderRadius: 5, marginTop: 10}}
                        placeholder={Identify.__('Enter Gift Card Credit')}
                        ref={input => { this.textInput = input }}
                        onChangeText={(txt) => { this.onChangeTextCredit(txt) }}
                    />
                    <Button
                        style={{marginTop: 10, width: '100%', justifyContent: 'center'}}
                        title={Identify.__('Apply Credit')}
                        onPress={() => this.handleUseCredit(1)}>
                        <Text>{Identify.__('Apply Credit')}</Text>
                    </Button>
                </View>
            )
        }
    }
    renderUseCreditLayout(data){
        return(
            <View>
                <ListItem onPress={() => this.updateCheck(1)}>
                    <Icon name={this.state.use_credit ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} />
                    <Body>
                    <Text>Use Gift Card credit to check out ({data.customer.balance})</Text>
                    </Body>
                </ListItem>
                {this.renderUseCreditActionLayout()}
            </View>
        )
    }
    renderUseListCodeActionLayout(data){
        if(this.state.use_giftcode){
            return (
                <View
                    style={{
                        padding: 12
                    }}
                >
                    <Text>{Identify.__('Enter a Gift Card code')}</Text>
                    {this.renderListGiftCodeUsed()}
                    {this.renderModal(this.state.dataDialog)}
                    <Input
                        style={{backgroundColor: '#d6d6d6', borderColor: '#383838', borderRadius: 5, marginTop: 10}}
                        placeholder={Identify.__('Enter Gift Card Code')}
                        ref={input => { this.textInput = input }}
                        onChangeText={(txt) => { this.onChangeTextCode(txt) }}
                    />
                    {this.renderListCustomerListCode(data.customer)}
                    <Button
                        style={{marginTop: 10, width: '100%', justifyContent: 'center'}}
                        title={Identify.__('Apply Gift Code')}
                        onPress={() => this.handleUseGiftCode(1)}>
                        <Text>{Identify.__('Apply Gift Code')}</Text>
                    </Button>
                </View>
            )
        }
    }
    renderUseListCodeLayout(data){
        return(
            <View>
                <ListItem onPress={() => this.updateCheck(2)}>
                    <Icon name={this.state.use_giftcode ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} />
                    <Body>
                    <Text>Use Gift Card to check out</Text>
                    </Body>
                </ListItem>
                {this.renderUseListCodeActionLayout(data)}
            </View>
        )
    }
    renderPhoneLayout(){
        let data = this.props.api_config === 1 ? this.parent.props.data : this.parent.props.data.order;
        if(data.hasOwnProperty('gift_card')){
            if(data.gift_card.use_giftcard){
                return(
                    <View>
                        {this.renderHeader()}
                        {this.renderUseCreditLayout(data.gift_card)}
                        {this.renderUseListCodeLayout(data.gift_card)}
                    </View>
                )
            }
            return <View>
                {this.renderHeader()}
                <Text style={{padding: 12}}>{data.gift_card.label}</Text>
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(ApplyGiftCode);