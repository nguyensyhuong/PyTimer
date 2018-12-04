import React from 'react';
import { connect } from 'react-redux';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import { StackActions } from 'react-navigation';
import { products_mode } from '@helper/constants';
import { Accordion, Header, View, Text } from "native-base";
import Device from '@helper/device';
import { Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Item from './item';
import Redriect from './redriect';
import Events from '@helper/config/events';

let height = Dimensions.get('window').height / 2;

class Zara extends React.Component {
    tracking(paramAction){
        let params = {...paramAction};
        params['event'] = 'home_action';
        Events.dispatchEventAction(params, this);
    }
    renderZaraImage(data, keyUrl, keyWidth, keyHeight, paramAction){
        this.tracking(paramAction)
        let url = data[keyUrl];
        let aspectRatio = data[keyWidth] / data[keyHeight];
        if (Device.isTablet()) {
            url = data[keyUrl + '_tablet'];
            aspectRatio = data[keyWidth + '_tablet'] / data[keyHeight + '_tablet'];
        }
        return (
            <Image
                style={{ width: '100%', aspectRatio: aspectRatio }}
                source={{ uri: url }}
                resizeMode="stretch" />
        );
    }

    renderHeader(item, expanded) {
        if (expanded === true) {
            setTimeout(() => {
                if (this.props.parent.scrollView) {
                    this.props.parent.scrollView.scrollTo({ x: 0, y: height, animated: true })
                }
            }, 200);
        }
        if (item.simicategory_id) {
            return this.renderZaraImage(item, 'simicategory_filename', 'width', 'height', {
                action: 'selected_category',
                category_id: item.simicategory_id
            });
        } else {
            return this.renderZaraImage(item, 'list_image', 'width', 'height', {
                action: 'selected_product_list',
                product_list_id: item.productlist_id
            });
        }
    }

    renderContentWithChildren(data){
        return (
            <FlatList
                ref={r => this.flatlist = r}
                data={data}
                keyExtractor={(item) => item.entity_id}
                renderItem={({ item, index }) =>
                    <Item item={item}/>
                } />
        )
    }

    directToOtherPage(item){
        let cat_name = item.cat_name
        let id = item.category_id
        let routeName = 'Products';
        let params = {};
        if (id) {
            params = {
                categoryId: id,
                categoryName: cat_name,
            };
        } else {
            params = {
                spotId: item.productlist_id,
                'mode': products_mode.spot,
            };
        }
        return <Redriect navigation={this.props.navigation} routeName={routeName} params={params} />;
    }

    renderContent(item) {
        if (item.has_children) {
            return this.renderContentWithChildren(item.children)
        } else {
            return this.directToOtherPage(item)
        }
    }

    render() {
        let categories = this.props.data.home.homecategories.homecategories;
        let products = this.props.data.home.homeproductlists.homeproductlists;
        let all_items = categories.concat(products);
        let allCategories = <Accordion
            dataArray={all_items}
            renderHeader={this.renderHeader.bind(this)}
            renderContent={this.renderContent.bind(this)}
        />
        return (
            <View>
                {allCategories}
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data };
}
export default connect(mapStateToProps)(Zara);
