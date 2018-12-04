import React from 'react';
import { Container, View, Text } from 'native-base';
import SimiPageComponent from '../../../../base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class TechSpecs extends SimiPageComponent {
  constructor(props) {
    super(props);
  }
  createContent() {
    let rows = [];
    let additional = this.props.navigation.getParam('additional');
    let shouldHightlight = true;
    for (let key in additional) {
      let item = additional[key];
      rows.push(
        <View key={key} style={{ backgroundColor: (shouldHightlight) ? '#EDEDED' : 'white', flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>
          <Text style={{ flex: 2, fontWeight: 'bold' }}>{item.label}</Text>
          <Text style={{ flex: 3, marginLeft: 5 }}>{item.value}</Text>
        </View>
      );
      shouldHightlight = !shouldHightlight;
    }
    return (rows);
  }

  renderPhoneLayout() {
    return (
      <Container style={{backgroundColor: variable.appBackground}}>
        {this.createContent()}
      </Container>
    );
  }

}

export default TechSpecs;
