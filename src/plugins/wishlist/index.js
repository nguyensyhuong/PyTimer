import React from 'react';
import { ScrollView, FlatList, TouchableOpacity, Image, View, Share, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, Card, Spinner, Text, Icon, Button, H3 } from 'native-base';
import styles from './styles';
import NewConnection from '@base/network/NewConnection';
import Price from '@screens/catalog/components/product/price';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { wishlist_item } from '../constants'
import { quoteitems } from '@helper/constants';
import material from '@theme/variables/material';

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

    getWishlist(limit, offset) {
        let params = [];
        params['limit'] = limit ?? this.limit;
        params['offset'] = offset ?? this.offset;
        try {
            new NewConnection()
                .init(wishlist_item, 'get_wishlist_data', this)
                .addGetData(params)
                .connect();
        } catch (e) {
            console.log(e.message);
        }
    }

    setData(data, requestId) {
        if (requestId != 'delete_item') {
            this.props.storeData('showLoading', { type: 'none' });
        }

        if (data.hasOwnProperty('quoteitems')) {
            this.props.storeData('actions', [
                { type: 'quoteitems', data: data }
            ]);
            return
        }

        let canLoadMore = true;
        if (this.offset + this.limit >= data.total) {
            canLoadMore = false;
        }

        if (requestId == 'add_to_cart') {
            this.getQuoteItems();
        }

        if (requestId == 'delete_item') {
            this.getWishlist(this.offset + this.limit, 0);
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
        if (requestId != 'add_to_cart' && requestId != 'delete_item') {
            this.setState({ 
                data: data, 
                loadMore: canLoadMore
            });
        }
    }

    getQuoteItems() {
        new NewConnection()
            .init(quoteitems, 'get_quoteitems', this)
            .connect();
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
                { text: Identify.__('NO'), onPress: () => { }, style: 'cancel' },
                {
                    text: Identify.__('YES'), onPress: () => {
                        this.props.storeData('showLoading', { type: 'dialog' });
                        this.state.data = null;
                        new NewConnection()
                            .init(wishlist_item + '/' + item.wishlist_item_id, 'delete_item', this, 'DELETE')
                            .connect();
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
            new NewConnection()
                .init(wishlist_item + '/' + item.wishlist_item_id, 'add_to_cart', this)
                .addGetData({ 'add_to_cart': '1' })
                .connect();
            this.props.storeData('showLoading', { type: 'dialog' });
            this.addCart = true;
        }
    }
    imageItemOnclick(item) {
        NavigationManager.openPage(this.props.navigation,
            'ProductDetail', {
                productId: item.product_id
            })
    }
    renderWishListItemImage(item) {
        return (
            <TouchableOpacity onPress={() => {
                this.imageItemOnclick(item)
            }}>
                <Image resizeMode='center' source={{ uri: item.product_image }} style={styles.imageListItem} />
                {!item.stock_status && <Text style={styles.outOfStock}>{Identify.__('Out of stock')}</Text>}
            </TouchableOpacity>
        )
    }
    renderWishlistItemInfor(item) {
        return (
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
                <H3 style={{ textAlign: 'left' }}>{item.name}</H3>
                {this.addPriceRow(item)}
                {item.stock_status && <Button full style={{ height: 40, marginTop: 15 }} onPress={() => {
                    this.addWishlistItemToCart(item);
                }}>
                    <Text>{Identify.__('Add To Cart')}</Text>
                </Button>}
            </View>
        )
    }
    renderWishlistItemAction(item) {
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
    generatePropsToFlatlist() {
        return {
            style: styles.verticalList,
            data: this.state.data.wishlistitems,
            extraData: this.state.data
        }
    }
    renderWishlistItems() {
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
    }

    renderPhoneLayout() {
        if (this.state.data && this.state.data.wishlistitems.length > 0) {
            return (
                <Container>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Button iconLeft transparent primary onPress={() => {
                            Share.share({
                                message: this.state.data.sharing_url[0]
                            });
                        }}>
                            <Icon name='share' />
                            <Text>{Identify.__('Share Wishlist')}</Text>
                        </Button>
                    </View>
                    {this.renderWishlistItems()}
                </Container>
            );
        }
        return (
            <Text style={{ textAlign: 'center', fontFamily: material.fontBold, fontSize: 20, marginTop: 30 }}>{Identify.__('Your wishlist is empty')}</Text>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.redux_data.quoteitems,
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
