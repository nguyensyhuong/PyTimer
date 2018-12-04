import React from 'react';
import SimiComponent from "../../../../core/base/components/SimiComponent";
import {Text, Card, CardItem, Body, Picker, Icon,  Label, Item,} from 'native-base';
import { View, StyleSheet } from 'react-native';
import {Slider} from 'react-native';
import Identify from "../../../../core/helper/Identify";

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
class GiftCardPrice extends SimiComponent{
    constructor(props){
        super(props)
        this.prices = this.props.prices;
        switch (this.prices.type_value){
            case 'fixed':
                this.state = {
                    value : this.prices.value
                };
                break;
            case 'range':
                let value = (this.prices.from + this.prices.to)/2;
                this.state = {
                    value : value
                };
                break;
            case 'dropdown':
                this.state = {
                    value : this.prices.options_value[0]
                };
                break;
        }
        this.parent = this.props.parent;
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    renderPricesFixedView= (prices) => {
        return(
            <CardItem>
                <Body>
                <Text>{Identify.__('Gift card fixed')}</Text>
                <Text style={{color: 'red'}}>{Identify.formatPrice(prices.price)}</Text>
                <Text>Gift card value : {Identify.formatPrice(prices.value)}</Text>
                </Body>
            </CardItem>
        )
    }
    renderPricesFixed = (prices) => {
        this.parent.amount = prices.value;
        this.parent.price_amount = prices.price;
        return this.renderPricesFixedView(prices)
    }

    renderValueRangeView = (prices, title, realPrice) => {
        return(
            <CardItem
                style={{
                    flex: 1,
                    flexDirection: 'column'
                }}
            >
                <Text>{Identify.__(title)}</Text>
                <Text style={{color: 'red'}}>{Identify.formatPrice(realPrice)}</Text>
                <View style={{ width: '100%'}}>
                    <Slider
                        maximumValue={prices.to}
                        minimumValue={prices.from}
                        step={1}
                        onValueChange={val => this.setState({value: val})}
                    />
                </View>
                <View style={{flex: 1, flexDirection: 'row', padding: 7}}>
                    <Text style={{flexGrow: 1}}>{Identify.formatPrice(prices.from)}</Text>
                    <Text style={{flexGrow: 1, textAlign: 'right'}}>{Identify.formatPrice(prices.to)}</Text>
                </View>
                <Text>Gift card value : ({Identify.formatPrice(prices.from)} - {Identify.formatPrice(prices.to)}) : {Identify.formatPrice(this.state.value)}</Text>
            </CardItem>
        )
    }
    renderValueRange = (prices) => {
        let price = this.state.value;
        let title = 'Range of value';
        if(prices.type_price === "percent"){
            price = price * prices.percent_value/100;
            title = 'Range of value and percent'
        }
        this.parent.amount = this.state.value;
        this.parent.price_amount = price;
        return this.renderValueRangeView(prices, title, price)
    }

    onValueChange(value) {
        this.setState({value : value})
    }

    renderValueDropdownView = (prices, realPrice) =>{
        let item = prices.options_value.map((item,index) => {
            return(
                <Picker.Item key={index} value={item} label={Identify.formatPrice(item)}/>
            )
        });
        return (
            <CardItem
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                }}
            >
                <Text>{Identify.__('Dropdown Price')}</Text>
                <Text style={{color: 'red'}}>{Identify.formatPrice(realPrice)}</Text>
                <Item picker style={styles.item} inlineLabel>
                    <Label>{Identify.__('Select price')}</Label>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        selectedValue={this.state.value}
                        onValueChange={this.onValueChange.bind(this)}>
                        {item}
                    </Picker>
                </Item>
            </CardItem>
        )
    }
    renderValueDropdown = (prices) => {
        let price = prices.prices_dropdown[this.state.value];
        this.parent.amount = this.state.value;
        this.parent.price_amount = price;
        return this.renderValueDropdownView(prices, price)
    }
    renderPhoneLayout(){
        let prices = this.props.prices;
        let value = this.renderPricesFixed(prices);
        if(prices.type_value === 'range'){
            value = this.renderValueRange(prices)
        }else if(prices.type_value === 'dropdown'){
            value = this.renderValueDropdown(prices)
        }
        return(
            <Card
                style={{
                    marginStart: 12,
                    marginEnd: 12
                }}
            >
                {value}
            </Card>
        )
    }
}
export default GiftCardPrice;