import React from 'react';
import SimiComponent from "../../../../base/components/SimiComponent";
import { Card, Text } from 'native-base';
import { TouchableOpacity, Image, View } from 'react-native';
import Swiper from 'react-native-swiper';
import NavigationManager from '../../../../helper/NavigationManager';
import Device from '../../../../helper/device';
import styles from './styles';
import Events from '@helper/config/events';
import Identify from '@helper/Identify';
import md5 from 'md5';

export default class ProductImagesComponent extends SimiComponent {

    tracking() {
        let params = {};
        params['event'] = 'product_action';
        params['action'] = 'showed_images_screen';
        params['product_name'] = this.props.product.name;
        params['product_id'] = this.props.product.entity_id;
        params['sku'] = this.props.product.sku;
        Events.dispatchEventAction(params, this);
    }

    onSelectImage(image) {
        NavigationManager.openPage(this.props.navigation, 'FullImage', {
            images: this.props.product.images,
            index: image['simi_index']
        });
    }

    renderImages() {
        let images = [];
        let data = JSON.parse(JSON.stringify(this.props.product.images));
        for (let i in data) {
            let image = data[i];
            image['simi_index'] = i;
            images.push(
                <TouchableOpacity
                    onPress={() => { this.onSelectImage(image) }}
                    key={image.position}
                    style={{ flex: 1 }}>
                    <Image resizeMode='contain' source={{ uri: image.url }}
                        style={[styles.bannerImage, (!Device.isTablet() || this.isPortrait()) && { aspectRatio: 1 }]} />
                </TouchableOpacity>
            );
            i++;
        }
        return images;
    }

    renderPhoneLayout() {
        if (this.props.product == null) {
            return (null);
        }
        return (
            <Card style={[styles.bannerCard, (!Device.isTablet() || this.isPortrait()) && { aspectRatio: 1 }]}>
                <View style={{flex: 1}}>
                    <Swiper
                        key={this.props.product.images.length}
                        horizontal={true}>
                        {this.renderImages()}
                    </Swiper>
                    {this.props.product.is_salable == '0' && <Text style={{position: 'absolute', bottom: 0, right: 0, backgroundColor: 'red', color: 'white', padding: 5, fontWeight: "bold"}}>{Identify.__('Out of stock')}</Text>}
                    {this.dispatchContent()}
                </View>
            </Card>
        );
    }

    dispatchContent() {
        let items = [];
        if(Events.events.add_labels) {
            for (let i = 0; i < Events.events.add_labels.length; i++) {
                let node = Events.events.add_labels[i];
                if (node.active === true) {
                    let key = md5("add_labels" + i);
                    let Content = node.content;
                    items.push(<Content key={key} product={this.props.product}/>)
                }
            }
        }
        return items;
    }
}
