import React from 'react';
import { Container, View } from 'native-base';
import { Image } from 'react-native';
import Swiper from 'react-native-swiper';
import SimiPageComponent from '../../../../base/components/SimiPageComponent';
import variable from '@theme/variables/material';

class FullImage extends SimiPageComponent {
  constructor(props) {
    super(props);
  }

  createImages() {
    let listImages = this.props.navigation.getParam('images');
    let images = [];
    for (let i in listImages) {
      let image = listImages[i];
      images.push(
        <View key={image.position} style={{ flex: 1 }}>
          <Image resizeMode='contain' source={{ uri: image.url }} style={{ flex: 1 }} />
        </View>
      );
    }
    return images;
  }

  renderPhoneLayout() {
    return (
      <Container style={{backgroundColor: variable.appBackground}}>
        <Swiper horizontal={true} index={parseInt(this.props.navigation.getParam('index'))}>
          {this.createImages()}
        </Swiper>
      </Container>
    );
  }

}

export default FullImage;
