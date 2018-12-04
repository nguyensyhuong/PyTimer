import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ListItem, Body, Right, Button, Icon, View, Text, Input } from 'native-base';
import Identify from '@helper/Identify';
import { StyleSheet, TextInput, Image, Alert, TouchableOpacity } from 'react-native';
import material from '@theme/variables/material';
import NavigationManager from '@helper/NavigationManager';
import QuoteItemView from './quote';

export default class QuoteItem extends SimiComponent {

    constructor(props) {
        super(props);
    }

    showDeleteItemPopup() {
        Alert.alert(
            'Warning',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', onPress: () => { style: 'cancel' } },
                {
                    text: 'OK', onPress: () => {
                        this.props.parent.updateCart(this.quoteItem.item_id, 0)
                    }
                },
            ],
            { cancelable: true }
        );
    }

    renderQtyBox() {
        let qtyBox = (
            <TextInput style={styles.qtyBox}
                placeholderTextColor="#000"
                value={parseInt(this.quoteItem.qty.toString()).toString()}
                editable={false}
                underlineColorAndroid="transparent" />
        );
        if (this.props.parent.from && this.props.parent.from == 'cart') {
            qtyBox = (
                <TextInput style={styles.qtyBox}
                    placeholderTextColor="#000"
                    defaultValue={this.quoteItem.qty.toString()}
                    keyboardType="numeric"
                    returnKeyType="done"
                    onSubmitEditing={(e) => { this.props.parent.qtySubmit(e, this.quoteItem.item_id, this.quoteItem.qty) }}
                    underlineColorAndroid="transparent" />
            );
        }
        return qtyBox;
    }

    renderMoveItem() {
        let remove_item = null;
        if (this.props.parent.from && this.props.parent.from == 'cart') {
            remove_item = (
                <Button style={{ position: 'absolute', top: 5, right: 5 }} transparent
                    onPress={() => { this.showDeleteItemPopup(this.quoteItem) }}>
                    <Icon name="ios-trash" />
                </Button>
            );
        }
        return remove_item;
    }
    onItemSelect() {
        let route = 'ProductDetail';
        if(this.quoteItem.product_type === 'simigiftvoucher'){
            route = 'ProductGiftCardDetail'
        }
        NavigationManager.openPage(this.props.parent.props.navigation,
            route, {
                productId: this.quoteItem.product_id,
            })
    }
    renderImageItem() {
        if (this.props.parent.is_go_detail) {
            return (
                <TouchableOpacity onPress={() => {
                    this.onItemSelect()
                }}>
                    <Image style={styles.viewImage} source={{ uri: this.quoteItem.image }} />
                </TouchableOpacity>
            )
        }
        return (
            <Image style={styles.viewImage} source={{ uri: this.quoteItem.image }} />
        )
    }

    renderPhoneLayout() {
        this.quoteItem = this.props.data;
        return (
            <ListItem>
                <Body style={styles.viewFlexBody}>
                    <View style={{ paddingTop: 5 }}>
                        {this.renderImageItem()}
                    </View>
                    <View style={{ marginLeft: 20, flex: 2 }}>
                        <Text style={styles.spaceLine}>{this.quoteItem.name}</Text>
                        <QuoteItemView item={this.quoteItem} style={styles.itemStyle} />
                        <View style={styles.viewFlexQty}>
                            <Text style={{ marginTop: 5, marginRight: 15 }}>{Identify.__('Quantity')}</Text>
                            {this.renderQtyBox()}
                        </View>
                    </View>
                </Body>
                <Right style={{}}></Right>
                {this.renderMoveItem()}
            </ListItem>
        );
    }
}

const styles = StyleSheet.create({
    qtyBox: { borderStyle: 'solid', width: 55, height: 35, fontSize: 13, borderColor: '#000', alignItems: 'center', borderWidth: 1, borderRadius: 4, textAlign: 'center' },
    spaceLine: { fontFamily: material.fontBold, marginBottom: 5, textAlign: 'left' },
    itemStyle: { marginBottom: 5, fontSize: material.textSizeSmall },
    viewFlexBody: { flex: 3, flexDirection: 'row' },
    viewFlexQty: { flex: 1, flexDirection: 'row', marginTop: 10 },
    viewImage: { borderColor: '#dedede', height: 110, width: 110, borderWidth: 1 },
    viewFlexCoupon: { flex: 3, flexDirection: 'row', marginTop: 20, marginLeft: 15, marginRight: 10 },
});