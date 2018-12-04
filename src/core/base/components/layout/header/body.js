import React from 'react';
import { Title } from 'native-base';
import variable from "@theme/variables/material";
import { StyleSheet, Dimensions, TouchableHighlight, Image, View } from 'react-native';
import { scale } from 'react-native-size-matters'

class BodyHeader extends React.Component {

  renderShowTitle() {
    return (
      <Title style={{ color: variable.toolbarBtnColor, textAlign: 'center' }}>{this.props.parent.props.title}</Title>
    );
  }

  renderShowLogo() {
    return (
      <TouchableHighlight onPress={() => { this.props.navigation.goBack(null); }} underlayColor="white">
        <Image source={require('../../../../../../media/logo.png')} style={styles.image} />
      </TouchableHighlight>
    );
  }

  render() {
    if (this.props.parent.props.title) {
      return (
        <View style={[{ flexGrow: 1 }, this.props.parent.props.show_right == false ? { width: '100%' } : { flex: 1 }]}>
          {this.renderShowTitle()}
        </View>
      );
    } else {
      return (
        <View style={[{ flexGrow: 1 }, this.props.parent.props.show_right == false ? { width: '100%' } : { flex: 1 }]}>
          {this.renderShowLogo()}
        </View>
      );
    }
  }
}

export const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  viewBodyPhone: {
    width: Dimensions.get('window').width, marginRight: scale(20)
  },
  viewBodyTablet: {
    width: Dimensions.get('window').width, marginLeft: scale(120), alignItems: 'center'
  },
  bodyAndroid: {
    alignItems: 'center', position: 'absolute', width: Dimensions.get('window').width
  },
  image: {
    height: 30, resizeMode: 'contain', width: '100%'
  }
});

export default BodyHeader;
