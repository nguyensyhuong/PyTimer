import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Content, Container, View, Text, Input, Button} from 'native-base'
import Identify from "../../core/helper/Identify";
import {check_code} from '../constants'
import Connection from '../../core/base/network/Connection';
import helperGiftCard from './helper'

export default class checkGiftCode extends SimiPageComponent{
    constructor(props){
        super(props)
        this.state = {
            ...this.state,
            data: null,
            text: ''
        }
    }
    setData(data){
        this.setState({data: data})
    }
    handleCheckGiftCode(){
        let json = {
            giftcode : this.state.text
        };
        Connection.setBodyData(json);
        Connection.connect(check_code, this, 'POST');
    }
    onChangeTextCredit(text){
        this.setState({text: text})
    }
    renderSearchSection(){
        return (
            <View
                style={{
                    padding: 12
                }}
            >
                <Text style={{fontWeight: '900'}}>{Identify.__('Enter Gift Code to check')}</Text>
                    <Input
                        style={{backgroundColor: '#d6d6d6', borderColor: '#383838', borderRadius: 5, marginTop: 10}}
                        placeholder={Identify.__('Enter Gift Code')}
                        onChangeText={(txt) => { this.onChangeTextCredit(txt) }}
                    />
                    <Button
                        style={{marginTop: 10, justifyContent: 'center'}}
                        title={Identify.__('Check Gift Code')}
                        onPress={() => {this.handleCheckGiftCode()}}>
                        <Text>{Identify.__('Check Gift Code')}</Text>
                    </Button>
            </View>
        )
    }
    renderResult(){
        if(this.state.data){
            let item = this.state.data;
            console.log(item)
            return (
                <View style={{padding: 12}}>
                    {helperGiftCard.renderListCodeLayoutItem(item.gift_code, Identify.__('Gift Card Code'), true)}
                    {helperGiftCard.renderListCodeLayoutItem(Identify.formatPrice(item.balance), Identify.__('Balance'))}
                    {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.checkStatus(item.status), Identify.__('Status'))}
                    {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.validateData(item.customer_name), Identify.__('Customer name'))}
                    {helperGiftCard.renderListCodeLayoutItem(item.expired_at, Identify.__('Expired Date'))}
                </View>
            )
        }
        return <View></View>
    }
    renderPhoneLayout(){
        return(
            <Container>
                <Content>
                    {this.renderSearchSection()}
                    {this.renderResult()}
                </Content>
            </Container>
        )
    }
}