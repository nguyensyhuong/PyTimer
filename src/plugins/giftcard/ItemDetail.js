import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Container, Text, View, Button, Content, Spinner, Toast, Input, Label, Item} from 'native-base';
import {Alert} from 'react-native'
import Identify from "../../core/helper/Identify";
import {my_giftcode_detail, send_mail, addredeem, my_giftcard} from '../constants'
import Connection from '../../core/base/network/Connection'
import {connect} from 'react-redux'
import NavigationManager from "../../core/helper/NavigationManager";
import helperGiftCard from "./helper";

class ItemDetail extends SimiPageComponent{
    constructor(props){
        super(props);
        this.isBack = true;
        this.state = {
            ...this.state,
            data: null,
            send_email : false,
            recipient_name: '',
            recipient_email: '',
            msg: ''
        }
        this.remove = 0;
        this.sendemail = 0;
        this.redeem = 0;
        this.msg = null;
        this.giftvoucher_id = this.props.navigation.getParam('giftvoucher_id');
        this.customer_voucher_id = this.props.navigation.getParam('customer_voucher_id')
    }
    componentDidMount(){
        this.requestData()
    }
    requestData(){
        Connection.restData();
        Connection.connect(my_giftcode_detail + '/' + this.giftvoucher_id ,this)
    }
    setData(data){
        this.props.storeData('showLoading',{type: 'none'})
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
            Toast.show({text: text, buttonText: "Okay", duration: 1500});
        } else {
            if(this.remove === 1 && data.simicustomercredit.message){
                Toast.show({text: data.simicustomercredit.message, buttonText: "Okay", duration: 2500});
                return;
            }
            if(this.sendemail === 1 && data.message.success){
                Toast.show({text: data.message.success, buttonText: "Okay", duration: 2500});
                this.setState({
                    send_email : false
                });
                this.sendemail = 0;
                return;
            }
            if(this.redeem === 1){
                Toast.show({text:data.message.success, buttonText: "Okay", duration: 2500});
                this.redeem = 0;
                this.requestData()
                return;
            }
            this.setState({data : data});
        }
    }
    changeBtn = ()=>{
        this.setState({
            send_email : true
        });
    };
    getActionHistory(action){
        let str = null;
        /*1 : Create
         2 : Update
         3 : Mass Update
         4 : Email
         5 : Spen Order
         6 : Refund
         7 : Redeem*/
        switch (parseInt(action,10)){
            case action = 1:
                str = 'Create';
                break;
            case action = 2:
                str = 'Update';
                break;
            case action = 3:
                str = 'Mass Update';
                break;
            case action = 4:
                str = 'Email';
                break;
            case action = 5:
                str = 'Spen Order';
                break;
            case action = 6:
                str = 'Refund';
                break;
            case action = 7:
                str = 'Redeem';
                break;
            default:
                str = 'Update';
        }
        return str;
    }
    renderHistory(history){
        if(history.length > 0){
            let listHistory = history.map( (item, index) => {
                return <View key={index} style={{borderTopWidth:0.3, borderColor: 'grey', paddingTop: 10, paddingBottom: 10}}>
                    {helperGiftCard.renderListCodeLayoutItem(this.getActionHistory(item.action), Identify.__('Action'))}
                    {helperGiftCard.renderListCodeLayoutItem(Identify.formatPrice(item.balance), Identify.__('Balance'))}
                    {helperGiftCard.renderListCodeLayoutItem(item.created_at, Identify.__('Date'))}
                    {helperGiftCard.renderListCodeLayoutItem(item.amount, Identify.__('Balance Change'))}
                    {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.validateData(item.order_increment_id), Identify.__('Order'))}
                    {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.validateData(item.comments), Identify.__('Comments'))}
                </View>
            })
            return listHistory;
        }
        return <Text>{Identify.__('There is no action in this gift code')}</Text>
    }
    renderCodeInfor(item){
        return (
            <View>
                {helperGiftCard.renderListCodeLayoutItem(item.gift_code, Identify.__('Gift Card Code'), true)}
                {helperGiftCard.renderListCodeLayoutItem(Identify.formatPrice(item.balance), Identify.__('Balance'))}
                {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.checkStatus(item.status), Identify.__('Status'))}
                {helperGiftCard.renderListCodeLayoutItem(item.added_date, Identify.__('Added Date'))}
                {helperGiftCard.renderListCodeLayoutItem(item.expired_at, Identify.__('Expired Date'))}
            </View>
        )
    }
    handleSendMail(id){
        let json = {
            voucher_id : id,
            recipient_name : this.state.recipient_name,
            recipient_email : this.state.recipient_email,
            message : this.state.msg
        };
        this.sendemail = 1;
        this.props.storeData('showLoading',{type: 'dialog'})
        Connection.setBodyData(json);
        Connection.connect(send_mail,this,'PUT');
    }
    handleRedeem(code) {
        let json = {
            giftcode : code
        }
        this.redeem = 1;
        this.props.storeData('showLoading', {type: 'dialog'})
        Connection.setBodyData(json)
        Connection.connect(addredeem,this, 'PUT');
    }
    okRemoveCode(){
        this.remove = 1;
        this.props.storeData('showLoading', {type: 'dialog'})
        Connection.connect(my_giftcard + '/' + this.customer_voucher_id, this, 'DELETE');
        NavigationManager.backToPreviousPage(this.props.navigation)
    }
    handleRemove(){
        Alert.alert(
            'Warning',
            'Are you sure you want to delete this gift code?',
            [
                { text: 'Cancel', onPress: () => { style: 'cancel' } },
                {
                    text: 'OK', onPress: () => {
                    this.okRemoveCode()
                }
                },
            ],
            { cancelable: true }
        );
    }
    renderBtn = (action, data)=>{
        let btn = null;
        if(action[0] === 'Email'){
            btn = <Button
                onPress={() => this.state.send_email ? this.handleSendMail(data.giftvoucher_id) : this.changeBtn()}
                style={{position:'absolute', bottom: 0, width: '100%', justifyContent: 'center'}}>
                <Text style={{textAlign: 'center', fontWeight: '900'}}>
                    {this.state.send_email ? Identify.__('Send to friend') : Identify.__('Email to friend')}
                </Text>
            </Button>
        }else if(action[0] === 'Redeem'){
            btn = <Button
                onPress={() => this.handleRedeem(data.gift_code)}
                style={{position:'absolute', bottom: 0, width: '100%', justifyContent: 'center'}}>
                <Text style={{textAlign: 'center', fontWeight: '900'}}>
                    {Identify.__('Redeem')}
                </Text>
            </Button>
        }else{
            btn = <Button
                onPress={() => this.handleRemove(data.giftvoucher_id)}
                style={{position:'absolute', bottom: 0, width: '100%', justifyContent: 'center'}}>
                <Text style={{textAlign: 'center', fontWeight: '900'}}>
                    {Identify.__('Remove')}
                </Text>
            </Button>
        }
        return btn;

    };
    handleChangeTextInput = (txt, keyChange)=>{
        this.state[keyChange] = txt;
    };
    renderInputItem(keyChange, label, value){
        return (
            <Item floatingLabel style={{marginTop : 15, marginBottom: 15}}>
                <Label>{label}</Label>
                <Input
                    value={value}
                    style={{borderColor: '#383838', borderRadius: 5}}
                    ref={input => { this.textInput = input }}
                    onChangeText={(txt) => { this.handleChangeTextInput(txt, keyChange) }}
                />
            </Item>
        )
    }
    renderEmailForm = (name,email,msg)=>{
        this.state.msg = msg;
        this.state.recipient_email = email;
        this.state.recipient_name = name
        return (
            <View>
                {this.renderInputItem('recipient_name', Identify.__('Recipient Name (*)'), name)}
                {this.renderInputItem('recipient_email', Identify.__('Recipient Mail (*)'), email)}
                {this.renderInputItem('msg', Identify.__('Message (*)'), msg)}
            </View>
        )
    }
    renderPhoneLayout(){
        if(this.state.data){
            let item = this.state.data.simigiftcode;
            let section = this.state.send_email ? <View>
                <Text style={{fontSize: 18, marginBottom: 10, marginTop: 10, fontWeight: '900'}}>{Identify.__('Send Email')}</Text>
                {this.renderEmailForm(item.recipient_name,item.recipient_email,item.message)}
            </View> :  <View style={{paddingBottom: 60}}>
                <Text style={{fontSize: 18, marginBottom: 10, marginTop: 10, fontWeight: '900'}}>{Identify.__('History')}</Text>
                {this.renderHistory(item.history)}
            </View>;
            return(
                <Container>
                    <Content style={{padding: 12}}>
                        <Text style={{fontSize: 18, marginBottom: 10, fontWeight: '900'}}>{Identify.__('Gift Card Code Information')}</Text>
                        {this.renderCodeInfor(item)}
                        {section}
                    </Content>
                    {this.renderBtn(item.actions, item)}
                </Container>
            )
        }
        return <Spinner color='grey'/>
    }
}
const mapStateToProps = (state) => {
    return { showLoading: state.redux_data.showLoading };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);