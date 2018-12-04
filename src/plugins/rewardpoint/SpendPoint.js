import React from 'react';
import SimiComponent from "../../core/base/components/SimiComponent";
import {Text, View} from 'native-base';
import {Slider} from 'react-native'
import Identify from "../../core/helper/Identify";
import material from '../../../native-base-theme/variables/material';
import {connect} from 'react-redux';
import Connection from "@base/network/Connection";
import {spend_point} from '../constants';

class SpendPoint extends SimiComponent{
    constructor(props){
        super(props);
        this.parent = this.props.parent;
        let spend_point = this.parent.props.data.loyalty_spend || 0;
        this.state = {
            value : spend_point
        };
    }

    handleSpentPoint = () => {
        let json = {
            ruleid: this.parent.props.data.order.loyalty.loyalty_rules[0].id,
            usepoint : this.state.value
        };
        Connection.restData();
        Connection.setBodyData(json);
        Connection.connect(spend_point, this, 'PUT');
        this.props.storeData('showLoading', { type: 'dialog' });
    }

    setData(data){
        this.parent.setData(data)
    }
    renderSpendPointLayout(data){
        return (
            <View style={{padding: 12}}>
                <View>
                    <Text>Each of {data.loyalty_rules[0].pointStepLabel} gets {data.loyalty_rules[0].pointStepDiscount} Discount</Text>
                </View>
                <View style={{padding: 15}}>
                    <Slider
                        maximumValue={data.loyalty_rules[0].maxPoints}
                        minimumValue={data.loyalty_rules[0].minPoints}
                        step={data.loyalty_rules[0].pointStep}
                        onValueChange={val => this.setState({value: val})}
                        onSlidingComplete={this.handleSpentPoint}
                    />
                </View>
                <View style={{flex: 1, flexDirection: 'row', padding: 15}}>
                    <Text style={{flexGrow: 1}}>{data.loyalty_rules[0].minPoints}</Text>
                    <Text style={{flexGrow: 1, textAlign: 'center'}}>Spending: {this.state.value}</Text>
                    <Text style={{flexGrow: 1, textAlign: 'right'}}>{data.loyalty_rules[0].maxPoints}</Text>
                </View>
            </View>
        )
    }
    renderView(){
        let data = this.parent.props.data.order.loyalty;
        if(data.loyalty_rules.length > 0){
            if(data.loyalty_rules[0].optionType === "needPoint"){
                return (
                    <View>
                        <Text style={{padding: 12}}>You need to earn more {data.loyalty_rules[0].needPointLabel} to use this rule</Text>
                    </View>
                )
            }
            return this.renderSpendPointLayout(data)
        }
    }

    render(){
        if(this.parent.props.data.order.hasOwnProperty('loyalty')){
            return(
                <View>
                    <Text style={{ fontFamily: material.fontBold, flex: 1, backgroundColor: '#EDEDED', paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>{Identify.__(this.props.title)}</Text>
                    {this.renderView()}
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpendPoint);