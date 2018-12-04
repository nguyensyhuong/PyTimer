import React from 'react';
import { H2 } from "native-base";
import Identify from '@helper/Identify';
import { StyleSheet } from 'react-native';

export default class ThankTitle extends React.Component{
  render(){
    return(
      <H2 style={styles.title}>{Identify.__('Thank you for your purchase')}</H2>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    color: '#AD2829',
    marginTop: 30
  },
});
