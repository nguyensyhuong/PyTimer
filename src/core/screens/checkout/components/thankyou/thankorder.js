import React from 'react';
import Identify from '@helper/Identify';
import { Container, Content, Button, Text, View, Icon, Card, H2 } from "native-base";
import { TouchableOpacity, StyleSheet } from 'react-native';
import NavigationManager from '@helper/NavigationManager';

export default class ThankOrder extends React.Component{
    onThankyouSelect(){
        NavigationManager.openPage(this.props.navigation, 'OrderHistoryDetail', {orderId: this.props.navigation.getParam('invoice')});
    }
    render(){
        return(
            <TouchableOpacity onPress={() => {
                this.onThankyouSelect()
            }}>
              <Card style={styles.card}>
                <View style={styles.cardContainer}>
                  <Text style={styles.orderLabel}>{Identify.__('Your order is')}: #{this.props.navigation.getParam('invoice')}</Text>
                  <Icon style={styles.extendIcon} name="ios-arrow-forward"/>
                </View>
              </Card>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    orderLabel: {
        flex: 1
    },
    extendIcon: {
        marginLeft: 5,
        fontSize: 20,
        color: '#c9c9c9'
    },
    button: {
        marginTop: 30
    },
    content: {
        padding: 20,
    },
});
