import React from 'react';
import { Text, View, Card, H3 } from "native-base";
import Identify from '@helper/Identify';
import YouTube from 'react-native-youtube'
import styles from './styles';

class VideoNative extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.product && this.props.product.product_video) {
      let listvideo = this.props.product.product_video
      let items = [];
      for (let i = 0; i < listvideo.length; i++) {
        let item = listvideo[i];
        items.push(<YouTube videoId={item.video_key} style={{ alignSelf: 'stretch', height: 200, marginTop: 10 }} key={i} apiKey="AIzaSyD8GPps7zSu8OMY6KiiJAhHhFVQnFTbPJs" />);
      }
      return (
        <Card style={styles.card}>
          <View>
            <H3>{Identify.__('Video')}</H3>
            {items}
          </View>
        </Card>
      )
    }
    return null;
  }
}

export default VideoNative;
