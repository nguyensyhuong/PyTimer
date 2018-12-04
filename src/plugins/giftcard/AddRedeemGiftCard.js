import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Text, Toast, Content, Container, View, Button, Input} from 'native-base';
import {connect} from 'react-redux';
import Connection from '../../core/base/network/Connection';
import Identify from "../../core/helper/Identify";
import NavigationManager from "../../core/helper/NavigationManager";
import {addlist, addredeem} from '../constants'
class AddRedeemGiftCard extends SimiPageComponent{
    constructor(props){
        super(props);
        this.isBack = true;
        this.giftCode = null;
        this.state ={
            ...this.state,
            text : ''
        }
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
            Toast.show({text : text});
        } else {
            Toast.show({text : data.message.success});
            this.props.storeData('showLoading', {type: 'dialog'});
            NavigationManager.openPage(this.props.navigation, 'MyGiftCard')
        }
    }

    AddRedem(param) {
        Connection.restData();
        Connection.setBodyData(param)
        Connection.connect(addredeem, this, 'PUT');
        this.props.storeData('showLoading', {type: 'dialog'})
    }

    AddList(param) {
        Connection.restData();
        Connection.setBodyData(param)
        Connection.connect(addlist, this, 'PUT');
        this.props.storeData('showLoading', {type: 'dialog'})
    }

    addAction = (type = 1) => {
        let giftcode = this.state.text;
        if(!giftcode || giftcode === ''){
            Toast.show({text: Identify.__('Please enter a Gift Code !')});
            return;
        }
        let json =  {
            giftcode
        };
        if(type === 1){
            this.AddRedem(json);
        }else {
            this.AddList(json);
        }
    }

    onChangeText(txt) {
        this.state.text = txt;
    }

    createLayout(){
        return(
            <Container>
                <Content>
                    <View style={{padding: 12}}>
                        <Text style={{fontSize: 20, marginBottom: 15}}>{Identify.__('Add/Redeem a Gift Card')}</Text>
                        <Input
                            style={{backgroundColor: '#d6d6d6', borderColor: '#383838', borderRadius: 5}}
                            placeholder={Identify.__('Enter Gift Card Code')}
                            autoFocus={true}
                            ref={input => { this.textInput = input }}
                            onChangeText={(txt) => { this.onChangeText(txt) }}
                        />
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', padding: 12}}>
                        <Button
                            style={{marginEnd: 5}}
                            title={Identify.__('REDEEM GIFT CARD')}
                            onPress={() => this.addAction(1)}>
                            <Text>{Identify.__('REDEEM GIFT CARD')}</Text>
                        </Button>
                        <Button
                            style={{marginStart: 5}}
                            title={Identify.__('ADDD GIFT CARD')}
                            onPress={() => this.addAction(2)}>
                            <Text>{Identify.__('ADD GIFT CARD')}</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
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
export default connect(mapStateToProps, mapDispatchToProps)(AddRedeemGiftCard);