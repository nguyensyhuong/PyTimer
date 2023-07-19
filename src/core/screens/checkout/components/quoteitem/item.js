import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ListItem, Body, Right, Button, Icon, View, Text, Input } from 'native-base';
import Identify from '@helper/Identify';
import { StyleSheet, TextInput, Image, Alert, TouchableOpacity, Dimensions } from 'react-native';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import QuoteItemView from './quote';
import OutStockLabel from '../../../catalog/components/product/outStockLabel';
import Entypo from 'react-native-vector-icons/Entypo'
const QuoteItem = (props) => {
    const listProductPreOrder = React.useMemo(() => {
        if (props.orderInfo?.product_pre_order && JSON.parse(props.orderInfo?.product_pre_order)) {
            return Object.keys(JSON.parse(props.orderInfo?.product_pre_order));
        } else {
            return [];
        }
    }, [props.orderInfo?.product_pre_order])
    function showDeleteItemPopup() {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to delete this product?'),
            [
                { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                {
                    text: Identify.__('OK'), onPress: () => {
                        props.parent.updateCart(props.data.item_id, 0)
                    }
                },
            ],
            { cancelable: true }
        );
    }

    function renderQtyBox() {
        let qtyBox = (
            <TextInput style={styles.qtyBox}
                placeholderTextColor="#000"
                value={parseInt(props.data.qty.toString()).toString()}
                editable={false}
                underlineColorAndroid="transparent" />
        );
        if (props.parent.from && props.parent.from == 'cart' && (!props.data.product.is_salable || (props.data.product.is_salable && Identify.TRUE(props.data.product.is_salable)))) {
            qtyBox = (
                <TextInput style={styles.qtyBox}
                    placeholderTextColor="#000000"
                    defaultValue={parseInt(props.data.qty.toString()).toString()}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={(e) => {
                        let qty = e.nativeEvent.text;
                        if (isNaN(qty)) {
                            Alert.alert(
                                Identify.__('Error'),
                                Identify.__('Quantity is not valid')
                            );
                            return;
                        }
                        props.parent.qtySubmit(e, props.data.item_id, props.data.qty)
                    }}
                    underlineColorAndroid="transparent" />
            );
        }
        return qtyBox;
    }

    function renderMoveItem() {
        let remove_item = null;
        if (props.parent.from && props.parent.from == 'cart') {
            remove_item = (
                <Button style={{ position: 'absolute', top: 5, right: 5 }} transparent
                    onPress={() => { showDeleteItemPopup(props.data) }}>
                    <Icon style={{ textAlign: 'right', marginLeft: 0, marginRight: 0 }} name="ios-trash" />
                </Button>
            );
        }
        return remove_item;
    }
    function onItemSelect() {
        let route = 'ProductDetail';
        if (props.data.product_type === 'simigiftvoucher') {
            route = 'ProductGiftCardDetail'
        }
        NavigationManager.openPage(props.parent.props.navigation,
            route, {
            productId: props.data.product_id,
        })
    }
    function renderImageItem() {
        if (props.parent.is_go_detail) {
            return (
                <TouchableOpacity onPress={() => {
                    onItemSelect()
                }}>
                    <Image style={[styles.viewImage, { borderWidth: 0.5, borderColor: material.imageBorderColor }]} source={{ uri: props.data.image }} resizeMode='contain' />
                    {renderOutStock()}
                </TouchableOpacity>
            )
        }
        if (typeof props.data.image === 'string') {
            return (
                <Image style={styles.viewImage} source={{ uri: props.data.image }} resizeMode='contain' />
            )
        } else {
            return (null)
        }
    }

    function renderOutStock() {
        if (props.data.product.hasOwnProperty('is_salable') && !Identify.TRUE(props.data.product.is_salable) && !Identify.getMerchantConfig().storeview?.preOrder?.enable) {
            return <OutStockLabel fontSize={12} />
        }
    }

    function renderItemContent() {
        return (
            <View style={{ marginLeft: 20, flex: 2 }}>
                <Text style={[styles.spaceLine, { fontFamily: material.fontBold }]}>{props.data.name}</Text>
                <QuoteItemView item={props.data} style={styles.itemStyle} />
                <View style={styles.viewFlexQty}>
                    <Text style={{ marginTop: 5, marginRight: 15 }}>{Identify.__('Quantity')}</Text>
                    {renderQtyBox()}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.listItem}>
            <Body style={[styles.viewFlexBody, { flex: 1 }]}>
                <View style={{ paddingTop: 5 }}>
                    {renderImageItem()}
                </View>
                <View style={{ width: Dimensions.get("window").width * 0.5 }}>
                    {renderItemContent()}
                </View>
            </Body>
            <Right />
            {renderMoveItem()}
            {
                // TH: Cart Page
                Identify.getMerchantConfig().storeview?.preOrder && Identify.getMerchantConfig().storeview?.preOrder?.enable && props.data?.cart_contain_preorder && <View style={styles.wrapperMessage}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Entypo name="warning" style={{ color: "#c07600", fontSize: 18 }} />
                    </View>
                    <Text style={styles.message}>
                        {Identify.__(Identify.getMerchantConfig().storeview?.preOrder?.note_in_cart)}
                    </Text>
                </View>
            }
            {
                // TH: Order detail
                props.orderInfo?.product_pre_order && listProductPreOrder && listProductPreOrder.includes(props?.data?.product_id) && <View style={styles.wrapperMessage}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Entypo name="warning" style={{ color: "#c07600", fontSize: 18 }} />
                    </View>
                    <Text style={styles.message}>
                        {Identify.__(Identify.getMerchantConfig().storeview?.preOrder?.note_in_cart)}
                    </Text>
                </View>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    message: { color: "#6f4401", width: '100%' },
    listItem: {
        marginRight: 15,
        marginLeft: 15,
        paddingRight: 0,
        paddingVertical: 15,
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1
    },
    wrapperMessage: { paddingVertical: 5, backgroundColor: '#fdf0d5', marginTop: 10, flexDirection: 'row', alignItems: 'center', width: '100%' },
    qtyBox: {
        borderStyle: 'solid', width: 55, height: 35, fontSize: 13, borderColor: '#000', alignItems: 'center', borderWidth: 1, borderRadius: 4, textAlign: 'center', color: 'black'
    },
    spaceLine: {
        fontFamily: material.fontBold, marginBottom: 5, textAlign: 'left'
    },
    itemStyle: {
        marginBottom: 5, fontSize: material.textSizeSmall
    },
    viewFlexBody: {
        flex: 3, flexDirection: 'row'
    },
    viewFlexQty: {
        flex: 1, flexDirection: 'row', marginTop: 10
    },
    viewImage: {
        borderColor: '#dedede', height: 110, width: 110, borderWidth: 1
    },
    viewFlexCoupon: {
        flex: 3, flexDirection: 'row', marginTop: 20, marginLeft: 15, marginRight: 10
    },
});

export default QuoteItem