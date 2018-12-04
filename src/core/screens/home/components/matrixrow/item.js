import React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import { products_mode } from '@helper/constants';
import Events from '@helper/config/events';
import { Text } from 'native-base';
import Identify from '@helper/Identify';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
    }
    generateData = (item) => {
        let imageUrl = '';
        const { height, width } = Dimensions.get('window');
        let widthPercent = parseFloat(item.matrix_width_percent);
        let heightPercent = parseFloat(item.matrix_height_percent);
        let itemWidth = widthPercent * width / 100;
        let itemHeight = heightPercent * width / 100;
        if (this.props.listSize > 1) {
            if (this.props.index != this.props.listSize - 1) {
                itemWidth += 5;
            } else {
                itemWidth -= 5;
            }
        }
        if (item.simicategory_filename) {
            imageUrl = item.simicategory_filename;
        } else if (item.list_image) {
            imageUrl = item.list_image;
        }
        let name = '';
        if (item.simicategory_name !== undefined) {
            name = item.simicategory_name;
        } else if (item.list_title) {
            name = item.list_title;
        }
        return {
            name,
            imageUrl,
            itemWidth,
            itemHeight
        }
    }
    renderItem(item) {
        let data = this.generateData(item);
        return (
            <View style={{ height: data.itemHeight, width: data.itemWidth, alignItems: 'center', justifyContent: 'center', paddingRight: this.props.index == this.props.listSize - 1 ? 0 : 5 }}>
                <Image
                    source={{ uri: data.imageUrl }}
                    style={{ width: '100%', height: data.itemHeight }} />
                {Identify.getMerchantConfig().storeview.base.is_show_home_title == '1' && <Text style={{ color: 'black', padding: 10, backgroundColor: 'rgba(255,255,255, 0.5)', position: "absolute" }}>{data.name.toUpperCase()}</Text>}
            </View>
        )
    }
    tracking(item) {
        let data = {};
        data['event'] = 'home_action';
        if (item.simicategory_filename) {
            data['action'] = 'selected_category';
            data['category_id'] = item.category_ids;
        } else {
            data['action'] = 'selected_product_list';
            data['product_list_id'] = item.productlist_id;
        }
        Events.dispatchEventAction(data, this);
    }
    selectItem(item) {
        if (item.simicategory_filename) {
            if (item.has_children) {
                routeName = 'Category';
                params = {
                    categoryId: item.category_id,
                    categoryName: item.cat_name,
                };
            } else {
                routeName = 'Products';
                params = {
                    categoryId: item.category_id,
                    categoryName: item.cat_name,
                };
            }
        } else {
            routeName = 'Products';
            params = {
                spotId: item.productlist_id,
                'mode': products_mode.spot,
            };
        }
        this.tracking(item);
        NavigationManager.openRootPage(this.props.navigation, routeName, params);
    }
    render() {
        if (this.props.item == null) return null;
        let item = this.props.item;
        return (
            <TouchableOpacity onPress={() => {
                this.selectItem(item);
            }}>
                {this.renderItem(item)}
            </TouchableOpacity>
        );
    }
}
Item.defaultProps = {
    item: null
}
