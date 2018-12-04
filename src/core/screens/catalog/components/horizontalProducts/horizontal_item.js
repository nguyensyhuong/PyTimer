import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Image, TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import Price from '../product/price';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles';
import { scale, verticalScale } from 'react-native-size-matters';
import Events from '@helper/config/events';
import md5 from 'md5';

class HorizontalItem extends SimiComponent {

    openProduct(item) {
        NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
            productId: item.entity_id,
            objData: item
        });
    }

    renderImage(item) {
        return (
            <View style={styles.imageListItem}>
                {item.images && <Image resizeMode='contain' source={{ uri: item.images[0].url }} style={styles.imageListItem} />}
                {item.is_salable == '0' && <Text style={styles.outOfStock}>{Identify.__('Out of stock')}</Text>}
                {this.dispatchContent()}
            </View>
        );
    }

    renderContent(item) {
        return (
            <View style={{ flex: 1, alignItems: 'flex-start', marginTop: 5 }}>
                <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                <Price
                    type={item.type_id}
                    prices={item.app_prices}
                    styleOneRowPrice={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}
                    styleDiscount={{ fontWeight: '100' }}
                    styleTwoRowPrice={{ flexDirection: 'column', justifyContent: 'space-between' }}
                />
            </View>
        );
    }

    render() {
        let item = this.props.item;
        return (
            <TouchableOpacity
                onPress={() => { this.openProduct(item) }}
                style={styles.listItem}
            >
                {this.renderImage(item)}
                {this.renderContent(item)}
            </TouchableOpacity>
        )
    }
    dispatchContent() {
        let items = [];
        if(Events.events.add_labels) {
            for (let i = 0; i < Events.events.add_labels.length; i++) {
                let node = Events.events.add_labels[i];
                if (node.active === true) {
                    let key = md5("add_labels" + i);
                    let Content = node.content;
                    items.push(<Content key={key} product={this.props.item}/>)
                }
            }
        }
        return items;
    }
}
export default HorizontalItem