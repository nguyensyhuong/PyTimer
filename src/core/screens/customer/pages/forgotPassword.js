import React from 'react'
import SimiPageComponent from "../../../base/components/SimiPageComponent";
import Identify from "../../../helper/Identify";
import { Container, Content, Form, Item, Input, Label , H3, Text, Button, Toast} from 'native-base';
import {forgotpassword} from '../../../helper/constants';
import Connection from '../../../base/network/Connection';
import NavigationManager from "../../../helper/NavigationManager";

export default class ForgotPassWordPage extends SimiPageComponent{
    constructor(props){
        super(props)
        this.isBack = true
        this.state = {
            ...this.state,
            email : ''
        }
    }

    validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }

    setData(data){
        if(!data.errors){
            Toast.show({text: 'Please check your email to reset password', type: "success" ,buttonText: "Okay", duration: 3000})
            NavigationManager.backToPreviousPage(this.props.navigation)
        }
    }

    resetPassword = () => {
        if(this.state.email === '' || this.state.email === null){
            Toast.show({text: 'This field is require', duration: 3000, type: 'warning'})
        }else {
            if(this.validateEmail(this.state.email)){
                let param = {
                    email: this.state.email
                }
                Connection.restData()
                Connection.setGetData(param)
                Connection.connect(forgotpassword,this)
            }else {
                this.setState({email: ''});
                Toast.show({text: Identify.__('Check your email and try again'), duration: 3000, type: 'warning'})
            }
        }
    }

    renderFormForgot = () => {
        return <Form>
            <Item stackedLabel style={{marginLeft: 0}}>
                <Label>{Identify.__('Enter Your Email').toUpperCase()}</Label>
                <Input
                    style={{
                        flex: 1,
                        borderWidth: 0.5,
                        borderColor: '#c3c3c3',
                        paddingStart: 15,
                        paddingEnd: 15,
                        height: 40,
                        marginTop: 15}}
                    placeholder='Email'
                    value={this.state.email}
                    onChangeText={(text) => {this.setState({email: text}); }}/>
            </Item>
            <Button
                disabled={!this.validateEmail(this.state.email)}
                style={{width: '100%', marginTop: 15, justifyContent: 'center'}}
                title='reset password'
                onPress={() => {this.resetPassword()}}
            >
                <Text style={{textAlign: 'center'}}>{Identify.__('Reset my password')}</Text>
            </Button>
        </Form>
    }

    renderPhoneLayout(){
        return(
            <Container>
                <Content style={{padding: 12}}>
                    {this.renderFormForgot()}
                </Content>
            </Container>
        )
    }
}