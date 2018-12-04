import React from 'react';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {Text, Toast, Content, Container, View, Left, Right, Body, Icon, ListItem} from 'native-base';
import {Image} from 'react-native';
import Connection from '../../core/base/network/Connection';
import {my_reward} from '../constants';
import Identify from '../../core/helper/Identify';
import {connect} from 'react-redux';
import styles from './styles'
import NavigationManager from '../../core/helper/NavigationManager';
import { scale, verticalScale } from 'react-native-size-matters';
import Device from '../../core/helper/device';

class MyReward extends SimiPageComponent{
    constructor(props){
        super(props)
        this.isBack = true;
        this.state = {
            ...this.state,
            data: null
        }
    }

    componentWillMount(){
        if(this.props.data.showLoading.type === 'none' && !this.state.data){
            this.props.storeData('showLoading', {type: 'full'})
        }
    }

    componentDidMount(){
        Connection.restData();
        Connection.connect(my_reward, this, 'GET')
    }

    setData(data){
        this.props.storeData('showLoading', {type: 'none'})

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
            Toast.show(text)
        } else {
            this.setState({data : data});
        }
    }
    renderRewardDetailInfor(data) {
        return (
            <View
                style={{
                    flexGrow: 1,
                    borderRightWidth: 0.3,
                    borderColor: '#4c4c4c',
                    paddingEnd: 30,
                    marginLeft: 30
                }}
            >
                <Text style={{fontSize: 35, textAlign: 'center', color: '#7a0000'}}>{data.point_balance}</Text>
                <Text style={{textAlign: 'center'}}>{Identify.__('AVAILABLE POINTS')}</Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: '#a8a8a8'}}>Equal {data.loyalty_redeem} to redeem</Text>
            </View>
        )
    }
    renderRewardRules(data){
        return (
            <View
                style={{
                    flexGrow: 2,
                    marginRight: 30,
                    marginLeft: 30,
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <View
                    style={{position: 'relative'}}
                >
                    <Image style={styles.img} source={require('./img/ic_reward_coin.png')}/>
                    <Text
                        style={{
                            position: 'absolute',
                            top: scale(18),
                            left: scale(7),
                            fontSize: scale(17),
                            textShadowColor: 'rgba(225, 225, 225, 0.75)',
                            textShadowOffset: {width: -2, height: 2},
                            color: '#474747'
                        }}
                    >{data.spending_discount}</Text>
                </View>
                {data.spending_min !== '' && data.start_discount !== '' && <Text style={{textAlign: 'center', fontSize: scale(12)}}>{data.spending_min} = {data.start_discount}</Text>}
            </View>
        )
    }
    renderRewardInfor = (data) => {
        return(
            <View style={styles.row}>
                {this.renderRewardDetailInfor(data)}
                {this.renderRewardRules(data)}
            </View>
        )
    }
    optionSelect(item, route){
        NavigationManager.openPage(this.props.navigation, route, {
            userId: item.customer_id,
            data: item
        });
    }
    renderRewardOption = (icon, name, item, route) => {
        return(
                <ListItem icon style={{...styles.textInfor}}
                          onPress={() => {
                              this.optionSelect(item, route)
                          }}
                >
                    <Left>
                        <Icon active name={icon} />
                    </Left>
                    <Body>
                        <Text>{name}</Text>
                    </Body>
                    <Right>
                        <Icon active name="ios-arrow-forward" />
                    </Right>
                </ListItem>
        )
    }

    renderEarnPointRule = (data) => {
        return(
            <View>
                <View>
                    <Text style={{...styles.textPadding,...styles.textLabel}}>{data.earning_label}</Text>
                </View>
                <View>
                    <Text style={{...styles.textPadding,...styles.textInfor}}>{data.earning_policy}</Text>
                </View>
            </View>
        )
    }

    renderSpendPointRule = (data) => {
        return(
            <View>
                <View>
                    <Text style={{...styles.textPadding,...styles.textLabel}}>{data.spending_label}</Text>
                </View>
                <View>
                    <Text style={{...styles.textPadding,...styles.textInfor}}>{data.spending_policy}</Text>
                </View>
            </View>
        )
    }

    renderView = () => {
        let data = this.state.data.simirewardpoint;
        return(
            <View >
                <View style={{backgroundColor: 'white'}}>
                    {this.renderRewardInfor(data)}
                    {this.renderRewardOption('md-medal', Identify.__('Rewards History'), data, 'RewardHistory')}
                    {this.renderRewardOption('md-settings', Identify.__('Settings'), data, 'SettingReward')}
                </View>
                {this.renderEarnPointRule(data)}
                {this.renderSpendPointRule(data)}
            </View>
        )
    }

    createLayout(){
        if(this.state.data){
            return(
                <Container style={{backgroundColor: '#eaeaea'}}>
                    <Content>
                        {this.renderView()}
                    </Content>
                </Container>
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
export default connect(mapStateToProps, mapDispatchToProps)(MyReward);