import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Text, Content, Container, View} from 'native-base';
import Identify from "../../core/helper/Identify";
import helperGiftCard from "./helper";

class MyGiftCardDetail extends SimiPageComponent{
    constructor(props){
        super(props);
        this.isBack = true;
        this.data = this.props.navigation.getParam('data');
    }

    renderBalance = (data) => {
        return(
            <View style={{paddingStart: 12, paddingEnd: 12, paddingTop: 12}}>
                <Text style={{fontSize: 20, fontWeight: '900'}}>{Identify.__('Balance')}</Text>
                <Text>My credit balance : {data.currency_symbol}{data.balance}</Text>
            </View>
        )
    }
    renderHistoryLayout(item,index){
        return (
            <View key={index} style={{padding: 12, borderTopWidth: 0.3, borderColor: '#c9c9c9'}}>
                {helperGiftCard.renderListCodeLayoutItem(item.action, Identify.__('Action'))}
                {helperGiftCard.renderListCodeLayoutItem(Identify.formatPrice(item.balance_change), Identify.__('Balance Change'))}
                {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.validateData(item.giftcard_code), Identify.__('Gift Card Code'))}
                {helperGiftCard.renderListCodeLayoutItem(helperGiftCard.validateData(item.order_number), Identify.__('Order'))}
                {helperGiftCard.renderListCodeLayoutItem(Identify.formatPrice(item.currency_balance), Identify.__('Current Balance'))}
                {helperGiftCard.renderListCodeLayoutItem(item.created_date, Identify.__('Changed Time'))}
            </View>
        )
    }
    renderHistory = (data) => {
        if(data.length > 0){
            let History = data.map((item, index) => {
                return this.renderHistoryLayout(item, index)
            })
            return (
                <View>
                    {History}
                </View>
            )
        }else {
            return(
                <View>
                    <Text>{Identify.__('Your history is empty !!')}</Text>
                </View>
            )
        }
    }

    createLayout(){
        return(
            <Container>
                <Content>
                    {this.renderBalance(this.data)}
                    <View>
                        <Text style={{fontSize:20, paddingStart: 12, paddingEnd: 12, paddingTop: 12, fontWeight: '900'}}>{Identify.__('Balance History')}</Text>
                        {this.renderHistory(this.data.history)}
                    </View>
                </Content>
            </Container>
        )
    }
}
export default MyGiftCardDetail;