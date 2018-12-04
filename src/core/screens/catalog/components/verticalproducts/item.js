import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity, Image, View } from 'react-native';
import { Card, CardItem, Text, Button } from 'native-base';
import NavigationManager from '@helper/NavigationManager';
import Price from '../../components/product/price';
import styles from './styles';
import Identify from '@helper/Identify';
import Events from '@helper/config/events';
import md5 from 'md5';
import Connection from '../../../../../core/base/network/Connection';
import { quoteitems } from '../../../../../core/helper/constants';
export default class VerticalProductItem extends SimiComponent {

    renderImage() {
        return (
            <CardItem cardBody>
                <View style={styles.image}>
                    <Image resizeMode='contain' source={{ uri: this.props.product.images[0].url }} style={styles.image} />
                    {this.props.product.is_salable == '0' && <Text style={styles.outOfStock}>{Identify.__('Out of stock')}</Text>}
                    {this.dispatchContent()}
                </View>
            </CardItem>
        );
    }
    renderName() {
        return (
            <CardItem>
                <Text style={styles.name} numberOfLines={this.props.showList ? undefined : 2}>{this.props.product.name}</Text>
            </CardItem>
        );
    }
    renderPrice() {
        return (
            <View style={{ flexGrow: 6 }}>
                <Price
                    type={this.props.product.type_id}
                    prices={this.props.product.app_prices}
                    styleDiscount={{ fontSize: 1, fontWeight: '100' }} />
            </View>
        );
    }
    renderAddBtn() {
        if (this.props.showList) {
            return (
                <Button
                    style={{ flexGrow: 1, justifyContent: 'center' }}
                    onPress={() => { this.onAddToCart() }}
                >
                    <Text style={{ fontSize: 14, textAlign: 'center', fontWeight: '900' }}>{Identify.__('Add To Cart')}</Text>
                </Button>
            )
        }
    }
    onAddToCart() {
        if (this.props.product.has_options !== '0') {
            NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                productId: this.props.product.entity_id
            })
        } else {
            let params = {};
            params['product'] = this.props.product.entity_id;
            params['qty'] = 1;

            this.props.storeData('showLoading', { type: 'dialog' });
            Connection.restData();
            Connection.setBodyData(params);
            Connection.connect(quoteitems, this, 'POST');
        }
    }
    renderItem() {
        return (
            <Card style={{ flex: 1 }}>
                {this.renderImage()}
                {this.renderName()}
                <View style={{ flexDirection: this.props.showList ? 'row' : 'column', paddingLeft: 15, paddingRight: 10, paddingBottom: 15 }}>
                    {this.renderPrice()}
                    {this.renderAddBtn()}
                </View>
            </Card>
        );
    }

    openProductDetail() {
        NavigationManager.openPage(this.props.navigation, this.props.layout, {
            productId: this.props.product.entity_id,
            objData: this.props.product,
        });
    }

    renderPhoneLayout() {
        return (
            <TouchableOpacity style={this.props.itemStyle}
                              onPress={() => { this.openProductDetail() }}>
                {this.renderItem()}
            </TouchableOpacity>
        );
    }

    dispatchContent() {
        let items = [];
        if (Events.events.add_labels) {
            for (let i = 0; i < Events.events.add_labels.length; i++) {
                let node = Events.events.add_labels[i];
                if (node.active === true) {
                    let key = md5("add_labels" + i);
                    let Content = node.content;
                    items.push(<Content key={key} product={this.props.product} />)
                }
            }
        }
        return items;
    }
}
