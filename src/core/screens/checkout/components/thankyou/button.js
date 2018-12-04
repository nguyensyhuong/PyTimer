import React from 'react';
import Identify from '@helper/Identify';
import { Container, Content, Button, Text, View, Icon, Card, H2 } from "native-base";
import { TouchableOpacity, StyleSheet } from 'react-native';

export default class ThankBody extends React.Component{
    render(){
        return(
            <Button full style={styles.button} onPress={() => {
                this.props.navigation.goBack(null);
            }}>
              <Text>{Identify.__('Continue Shopping')}</Text>
            </Button>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        marginTop: 30
    },
});
