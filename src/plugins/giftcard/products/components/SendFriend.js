import React from 'react';
import SimiComponent from "../../../../core/base/components/SimiComponent";
import {View, Text, Toast, CardItem, Card, ListItem, CheckBox, Item, Label, Textarea, Input, DatePicker, Icon, Body} from "native-base";
import { ScrollView, NativeModules, Platform } from 'react-native';
import Identify from "../../../../core/helper/Identify";

class SendFriend extends SimiComponent{
    constructor(props){
        super(props);
        this.parent = this.props.parent;
        let timezone = this.parent.state.data.simigiftcard.timezone;
        this.state = {
            post_office : false,
            via_email : false,
            notif : false,
            day_send : new Date(),
            timezone
        };
        this.list_timezone = null;
        this.msg = null;
    }

    updateCheck(type = 1) {
        if(type === 1){
            this.setState((oldState) => {
                return {
                    post_office: !oldState.post_office,
                };
            });

        }else if(type === 2) {
            this.setState((oldState) => {
                return {
                    via_email: !oldState.via_email,
                };
            });
        }else if(type === 3){
            this.setState((oldState) => {
                return {
                    notif: !oldState.notif,
                };
            });
        }
    }

    handleChangeTextInput = (txt, keyChange)=>{
        this.parent[keyChange] = txt;
    };

    handleChangeMsg = (txt) => {
        let max = parseInt(this.parent.state.data.simigiftcard.simigiftcard_settings.simigift_message_max,10);
        let value = txt;
        if(value.length >= max){
            txt = this.msg;
            Toast.show({text: `Message max length (${max}) `});
            return;
        }
        this.msg = value;
        this.parent.message = this.msg;
    };

    handleChangeDate = (date) => {
        this.setState({
            day_send: date,
        });
    };

    renderInputItem(keyChange, label){
        return (
            <Item floatingLabel style={{marginTop : 15, marginBottom: 15}}>
                <Label>{label}</Label>
                <Input
                    style={{borderColor: '#383838', borderRadius: 5}}
                    ref={input => { this.textInput = input }}
                    onChangeText={(txt) => { this.handleChangeTextInput(txt, keyChange) }}
                />
            </Item>
        )
    }

    renderSendToEmail(){
        let day_to_send = this.parent.state.data.simigiftcard.simigiftcard_settings.is_day_to_send === "1" ?
            <View>
                <View>
                    <Text>{Identify.__('Scheduled Sending Date *')}</Text>
                    <DatePicker
                        defaultDate={this.state.day_send}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        placeHolderText={`${this.state.day_send}`}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.handleChangeDate}
                    />
                </View>
            </View> : null;
        return(
            <View>
                {this.renderInputItem('customer_name', Identify.__('Sender Name'))}
                {this.renderInputItem('recipient_name', Identify.__('Recipient Name'))}
                {this.renderInputItem('recipient_email', Identify.__('Recipient Email')+'(*)')}
                <Item style={{flex: 1, flexDirection: 'column',marginTop : 15, marginBottom: 15, justifyContent: 'flex-start'}}>
                    <Label>{Identify.__('Message')+'(*)'}</Label>
                    <Textarea maxLength={parseInt(this.parent.state.data.simigiftcard.simigiftcard_settings.simigift_message_max,10)} rowSpan={5} bordered style={{width: '100%'}} onChangeText={(txt) => { this.handleChangeMsg(txt) }}/>
                </Item>
                <View style={{marginTop : 15, marginBottom: 15}}>
                    <ListItem onPress={() => this.updateCheck(3)}>
                        <Icon name={this.state.notif ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} />
                        <Body>
                        <Text
                            style={{ marginStart: 7}}
                        >{Identify.__('Get notification email when your friend receives Gift Card')}</Text>
                        </Body>
                    </ListItem>
                </View>
                {day_to_send}
            </View>
        )
    }

    renderView = () => {
        let post_office = this.state.post_office ? <Text style={{color : '#fb9803',marginTop: 5}}>
            {Identify.__("You will need to find in your friend's address as the shipping address on checkout page.We will send this Gift Card to that address")}
        </Text> : null;
        this.parent.recipient_ship = this.state.post_office;
        this.parent.send_friend = this.state.via_email;
        this.parent.notify_success = this.state.notif;
        let via_email = this.state.via_email ? this.renderSendToEmail() : null;
        post_office = this.parent.state.data.simigiftcard.simigiftcard_settings.simigift_postoffice === "1" ?
            <View
                style={{
                    width: '100%'
                }}
            >
                <ListItem onPress={() => this.updateCheck(1)}>
                    <Icon name={this.state.post_office ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} />
                    <Body>
                    <Text
                        style={{fontSize : 16, marginStart: 7}}
                    >{Identify.__('Send to friend via post office')}</Text>
                    </Body>
                </ListItem>

                {post_office}
            </View> : null;

        return (
            <CardItem
                style={{
                    flex: 1,
                    flexDirection: 'column'
                }}
            >
                {post_office}
                <View
                    style={{
                        width: '100%'
                    }}
                >
                    <ListItem onPress={() => this.updateCheck(2)}>
                        <Icon name={this.state.via_email ? 'ios-checkmark-circle-outline' : 'ios-radio-button-off-outline'} />
                        <Body>
                        <Text
                            style={{fontSize : 16, marginStart: 7}}
                        >
                            {Identify.__('Send to friend via email')}
                        </Text>
                        </Body>
                    </ListItem>
                    {via_email}
                </View>
            </CardItem>
        )
    }

    renderPhoneLayout(){
        return(
            <Card
                style={{
                    marginEnd: 12,
                    marginStart: 12,
                }}
            >
                {this.renderView()}
            </Card>
        )
    }
}
export default SendFriend