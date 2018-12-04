import React from 'react';
import { Text } from "native-base";
import Identify from '@helper/Identify';
import { StyleSheet } from 'react-native';

export default class ThankBody extends React.Component{
    render(){
        return(
            <Text style={styles.message}>{Identify.__('You have placed an order successfully!')}</Text>
        );
    }
}
const styles = StyleSheet.create({
    message: {
        marginTop: 30
    },
});
