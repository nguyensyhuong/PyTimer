import React from 'react';
import { Container, Content } from "native-base";
import SimiPageComponent from "@base/components/SimiPageComponent";
import variable from '@theme/variables/material';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

class Thankyou extends SimiPageComponent{
  componentDidMount() {
    this.props.clearData();
  }
  renderPhoneLayout(){
    return (
        <Container style={{backgroundColor: variable.appBackground}}>
            <Content style={styles.content}>
                {this.renderLayoutFromConfig('thankyou_layout', 'content')}
            </Content>
            {this.renderLayoutFromConfig('thankyou_layout', 'container')}
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
      clearData: () => {
          dispatch({ type: 'clear_checkout_data', data: null })
      }
    };
};

export default connect(null, mapDispatchToProps)(Thankyou);
