import React from 'react';
import SimiPageComponent from "../../../core/base/components/SimiPageComponent";
import { Container, Content, Icon, View, Fab, Button, Text, Spinner, CardItem, Card, Toast} from "native-base";
import { ScrollView, NativeModules, Platform, Image } from 'react-native';
import Connection from '../../../core/base/network/Connection';
import { connect } from 'react-redux';
import { giftcard_product } from '../../constants';
import GiftCardPrice from './components/GiftCardPrice';
import SendFriend from './components/SendFriend'
import Description from '../../../core/screens/catalog/components/product/description';
import AddToCart from '../../../core/screens/catalog/components/product/AddToCart'
import Events from '../../../core/helper/config/events';
import Template from './components/Template';
import md5 from 'md5'
import Identify from "../../../core/helper/Identify";
import Review from '../../review/reviewProductDetail';

class GiftCardProductDetail extends SimiPageComponent{
    constructor(props){
        super(props);
        this.isBack = true;
        this.productId = -1;
        this.useDiffLayoutForHorizontal = true;
        this.useTabletLayout = true;
        this.existData = false;
        this.amount = 0; // gift card value
        this.price_amount = 0; // gift card price
        this.giftcard_template_image = null;
        this.giftcard_template_id = null;
        this.giftcard_use_custom_image = 0;
        this.recipient_ship = false;
        this.send_friend = false;
        this.customer_name = null;
        this.recipient_name = null;
        this.recipient_email = null;
        this.message = null;
        this.notify_success = false;
        this.day_to_send = null;
        this.objData = this.props.navigation.getParam('objData');
        this.state = {
            ...this.state,
            data : null,
            url_image : '',
            giftcard_template_image: '',
            id: 0,
        }
        this.changeTemplate = false
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none' && !this.state.data) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (!this.state.data) {
            Connection.restData();
            Connection.connect(giftcard_product + '/' + this.props.navigation.getParam("productId"), this, 'GET');
        }
    }

    setData(data) {
        this.setState({data: data, url_image: data.simigiftcard.simigift_template_ids[0].images[0].url, giftcard_template_image: data.simigiftcard.simigift_template_ids[0].images[0].image})
        this.props.storeData('showLoading', { type: 'none' } );
    }

    handleChangeImg = (url, name, type = 0)=>{
        this.setState({url_image : url, giftcard_template_image: name});
        if(type === 1){
            this.giftcard_use_custom_image = 1
        }
    };

    handleChangeTemplate = (value) => {
        this.setState({
            id : value
        });
        this.changeTemplate = true;
    };

    getUrlImage(item){
        if(this.state.url_image === ''){
            this.setState({url_image: item.url, giftcard_template_image: item.image});
            return this.state.url_image;
        }
        if(this.changeTemplate){
            this.changeTemplate = false;
            this.setState({url_image: item.url, giftcard_template_image: item.image});
            return item.url
        }
        return this.state.url_image;
    }

    renderProductImage = (data) => {
        let template = data.simigift_template_ids[this.state.id];
        let item = template.images[0];
        let barcode = data.barcode;
        return (
            <Card
                style={{marginEnd: 12, marginStart: 12}}
            >
                <CardItem
                    style={{flex: 1}}
                >
                    <Image
                        source={{uri: this.getUrlImage(item)}}
                        style={{width: null, height: 200, flex: 1}}
                    />
                </CardItem>

                <Text style={{
                    fontSize:18,
                    paddingStart: 12,
                    paddingEnd: 12
                }}>
                    Hope you enjoy this gift card
                </Text>
                <CardItem style={{
                    padding:10,
                    justifyContent:'space-between'
                }}>
                    <View>
                        <Text
                            style={{
                                fontSize:20
                            }}
                        >$0.00</Text>
                        <Text
                            style={{}}
                        >GIFT-XXXX-XXXX</Text>
                    </View>
                    <View style={{width:'60%'}}>
                        <Image source={{uri: barcode.image}} style={{width: null, height: 60, flex: 1}}/>
                        <Text style={{}}>Expired: {barcode.expire_day}</Text>
                    </View>
                </CardItem>
                <CardItem>
                    <Template parent={this} data={data.simigift_template_ids} />
                </CardItem>
            </Card>
        )
    }

    createLayout(){
        if(this.state.data){
            let data = this.state.data.simigiftcard;
            let buttons = this.dispatchPlugin(data,'giftcard_checkout');
            let review = this.dispatchPlugin(data, 'giftcard_review');
            return(
                <Container>
                    <Content style={{marginBottom: 60}}>
                        <View>
                            {this.renderProductImage(data)}
                            <GiftCardPrice prices={data.giftcard_prices} parent={this} onRef={ref => (this.namePrices = ref)}/>
                            {buttons.length > 0 && buttons}
                            <Description parent={this} navigation={this.props.navigation} product={data}/>
                            <SendFriend parent={this} onRef={ref => (this.options = ref)}/>
                            {review.length > 0 && review}
                        </View>
                    </Content>
                    <AddToCart parent={this} navigation={this.props.navigation} product={data}/>
                </Container>
            )
        }
        return null
    }
    dispatchPlugin(data,keyPlugin){
        let plugins = [];
        for (let i = 0; i < Events.events[keyPlugin].length; i++) {
            let node = Events.events[keyPlugin][i];
            if (node.active === true) {
                let key = md5(keyPlugin + i);
                let Content = node.content;
                plugins.push(<Content key={key}
                    obj={this} product={data}/>);
            }
        }
        return plugins;
    }
    getOptionParams = () => {
        let json = {
            amount : this.amount,
            price_amount : this.price_amount,
            giftcard_template_id : this.giftcard_template_id,
            giftcard_template_image : this.state.giftcard_template_image,
            url_image : this.state.url_image,
        };
        json['giftcard_use_custom_image'] = this.giftcard_use_custom_image ? 1 : null;
        json['recipient_ship'] = this.recipient_ship ? 'Yes' : null;
        if(this.send_friend){
            json['send_friend'] = 1;
            json['customer_name'] = this.customer_name ? this.customer_name : null;
            if(this.recipient_name){
                json['recipient_name'] = this.recipient_name;
            }else {
                Toast.show({text: 'Please Enter Recipient Name !'});
                return;
            }
            if(!this.recipient_email){
                Toast.show({text: 'Please Enter Recipient Email !'});
                return;
            }else{
                let email = this.recipient_email;
                if (!this.validateEmail(email))
                {
                    Toast.show({text: 'Recipient Email Invalid !'});
                    return;
                }else {
                    json['recipient_email'] = email;
                }
            }
            if(this.message){
                let max = parseInt(this.state.data.simigiftcard.simigiftcard_settings.simigift_message_max,10);
                let msg = this.message;
                if(msg.length >= max){
                    Toast.show({text: `Message max length (${max}) `});
                    return;
                }else {
                    json['message'] = msg;
                }
            }

        }
        json['notify_success'] = this.notify_success ?  1 : null;
        json['day_to_send'] = this.day_to_send ? this.day_to_send : null;
        json['timezone_to_send'] = this.timezone_to_send ? this.timezone_to_send : null;
        return json;
    }

    validateEmail = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false)
            return false;
        else
            return true;
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data};
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftCardProductDetail);