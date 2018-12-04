import React from 'react';
import { ScrollView, FlatList, TouchableOpacity, Image, View, Share, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, Card, Spinner, Text, Icon, Button, H3 } from 'native-base';
import styles from './styles';
import Connection from '../../core/base/network/Connection';
import Price from '../../core/screens/catalog/components/product/price';
import Identify from '../../../src/core/helper/Identify';
import NavigationManager from '../../../src/core/helper/NavigationManager';
import SimiPageComponent from "../../core/base/components/SimiPageComponent";
import {wishlist_item} from '../constants'
class Wishlist extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isPage = true;
        this.state = {
            ...this.state,
            data: null,
            loadMore: false,
        };
        this.back = true;
        this.data = [];
        this.limit = 5;
        this.offset = 0;
        this.lastY = 0;
        this.isLoadingMore = false;
        this.refresh = this.props.navigation.getParam("refresh", null);
    }

    componentDidMount() {
        this.props.storeData('showLoading', { type: 'full' });
        this.getWishlist();
    }

    getWishlist() {
        let params = [];
        params['limit'] = this.limit;
        params['offset'] = this.offset;
        try {
            Connection.restData();
            Connection.setGetData(params);
            Connection.connect(wishlist_item, this, 'GET');
        } catch (e) {
            console.log(e.message);
        }
    }

    setData(data) {
        if (this.props.loading != 'none') {
            this.props.storeData('showLoading', { type: 'none' });
        }

        let canLoadMore = true;
        if (this.offset + this.limit >= data.total) {
            canLoadMore = false;
        }
        if (this.addCart) {
            this.state.data = null;
            this.addCart = false;
            this.offset = 0;
            this.getWishlist();
        }
        if (this.isLoadingMore) {
            let combinedWishlistItems = this.state.data.wishlistitems;
            combinedWishlistItems.push.apply(combinedWishlistItems, data.wishlistitems);
            data.wishlistitems = combinedWishlistItems;

            let combinedIds = this.state.data.all_ids;
            combinedIds.push.apply(combinedIds, data.all_ids);
            data.all_ids = combinedIds;
        }
        this.isLoadingMore = false;
        this.setState({ data: data, loadMore: canLoadMore });
    }

    handleWhenRequestFail() {
        if (this.props.loading != 'none') {
            this.props.storeData('showLoading', { type: 'none' });
        }
    }

    addPriceRow(item) {
        return (
            <Price type={item.type_id} prices={item.app_prices} styleDiscount={{ fontSize: 1, fontWeight: '100' }} />
        )
    }

    deleteWishlistItem(item) {
        Alert.alert(
            Identify.__('Confirmation'),
            Identify.__('Are you sure you want to delete this product?'),
            [
                { text: 'NO', onPress: () => { }, style: 'cancel' },
                {
                    text: 'YES', onPress: () => {
                    this.props.storeData('showLoading', { type: 'dialog' });
                    this.state.data = null;
                    Connection.restData();
                    Connection.connect(wishlist_item + '/' + item.wishlist_item_id, this, 'DELETE');
                }
                },
            ],
            { cancelable: false }
        )
    }

    addWishlistItemToCart(item) {
        if (item.selected_all_required_options == false) {
            NavigationManager.openPage(this.props.navigation, 'ProductDetail', {
                productId: item.product_id,
            });
        } else {
            Connection.restData();
            Connection.setGetData({ 'add_to_cart': '1' });
            Connection.connect(wishlist_item + '/' + item.wishlist_item_id, this, 'GET');
            this.props.storeData('showLoading', { type: 'dialog' });
            this.addCart = true;
        }
    }
    imageItemOnclick(item){
        NavigationManager.openPage(this.props.navigation,
            'ProductDetail', {
                productId: item.product_id
            })
    }
    renderWishListItemImage(item){
        return (
            <TouchableOpacity onPress={() => {
                this.imageItemOnclick(item)
            }}>
                <Image resizeMode='center' source={{ uri: item.product_image }} style={styles.imageListItem} />
                {!item.stock_status && <Text style={styles.outOfStock}>{Identify.__('Out of stock')}</Text>}
            </TouchableOpacity>
        )
    }
    renderWishlistItemInfor(item){
        return (
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
                <H3>{item.name}</H3>
                {this.addPriceRow(item)}
                {item.stock_status && <Button full style={{ height: 40, marginTop: 15 }} onPress={() => {
                    this.addWishlistItemToCart(item);
                }}>
                    <Text>{Identify.__('Add To Cart')}</Text>
                </Button>}
            </View>
        )
    }
    renderWishlistItemAction(item){
        return (
            <View style={{ width: 40, alignItems: 'flex-end' }}>
                <TouchableOpacity
                    style={styles.buttonIcon}
                    onPress={() => {
                        this.deleteWishlistItem(item);
                    }}>
                    <Icon name='close' style={{ fontSize: 28 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[{ marginTop: 10 }, styles.buttonIcon]}
                    onPress={() => {
                        Share.share({
                            message: item.product_sharing_message
                        });
                    }}>
                    <Icon name='share' style={{ fontSize: 28 }} />
                </TouchableOpacity>
            </View>
        )
    }
    renderItem(item) {
        return (
            <Card key={item.wishlist_item_id}>
                <View style={styles.itemView}>
                    {this.renderWishListItemImage(item)}
                    {this.renderWishlistItemInfor(item)}
                    {this.renderWishlistItemAction(item)}
                </View>
            </Card>
        );
    }

    loadMore = () => {
        if (this.offset + this.limit < this.state.data.total && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.offset += this.limit;
            this.getWishlist();
        }
    }
    generatePropsToFlatlist(){
        return {
            style : styles.verticalList,
            data : this.state.data.wishlistitems,
            extraData : this.state.data
        }
    }
    renderWishlistItems() {
        if (this.state.data) {
            return (
                <ScrollView
                    onScroll={({ nativeEvent }) => {
                        if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
                            this.loadMore();
                        }
                    }}
                >
                    <FlatList
                        {...this.generatePropsToFlatlist()}
                        keyExtractor={(item) => item.wishlist_item_id}
                        renderItem={({ item }) =>
                            <View>
                                {this.renderItem(item)}
                            </View>
                        }
                    />
                    <Spinner style={(this.state.loadMore) ? {} : { display: 'none' }} />
                </ScrollView>
            );
        } else {
            return (<View />);
        }
    }

    renderPhoneLayout() {
        return (
            <Container>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Button iconLeft transparent primary onPress={() => {
                        Share.share({
                            message: this.state.data.message[0]
                        });
                    }}>
                        <Icon name='share' />
                        <Text>Share Wishlist</Text>
                    </Button>
                </View>
                {this.renderWishlistItems()}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.redux_data.showLoading,
        wishlist: state.redux_data.wishlist,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
