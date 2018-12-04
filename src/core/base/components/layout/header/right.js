import React from 'react';
import { Button, Right, Icon, Badge, Text } from 'native-base';
import variable from "@theme/variables/material";
import { StyleSheet, Platform, TouchableHighlight, View } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Device from '@helper/device';
import { products_mode } from "@helper/constants";

class RightHeader extends React.Component {

    renderQty() {
        let qtyStyle = { position: 'absolute', right: -8, top: 0, height: 20, paddingBottom: 2 }
        let textQtyStyle = Platform.OS === "ios" ? { fontSize: 8, lineHeight: 0 } : { fontSize: 9 };
        let qty = this.props.parent.props.data.cart_total ? (
            <TouchableHighlight style={qtyStyle}
                onPress={() => { NavigationManager.openRootPage(this.props.navigation, 'Cart', {}); }}>
                <Badge style={{ height: 20, alignItems: "center", justifyContent: 'center' }}>
                    <Text style={textQtyStyle}>{this.props.parent.props.data.cart_total}</Text>
                </Badge>
            </TouchableHighlight>
        ) : null;
        return (qty); 
    }

    renderCart() {
        return (
            <Icon name="cart"
                style={{ color: variable.toolbarBtnColor, fontSize: 23, padding: 7 }}
                onPress={() => {
                    NavigationManager.openRootPage(this.props.navigation, 'Cart', {});
                }} />
        );
    }

    renderSearch() {
        let search = this.props.parent.props.showSearch ? <Icon name='search'
            style={{ fontSize: 23, color: variable.toolbarBtnColor, marginRight: Device.isTablet() ? 5 : 0, padding: 7 }}
            onPress={() => {
                this.openSearchPage();
            }} /> : null;
        return (search);
    }

    render() {
        if (this.props.parent.props.show_right == false) {
            return <Right style={styles.bothLeftRight} />;
        }
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.renderSearch()}
                {this.renderCart()}
                {this.renderQty()}
            </View>
        )
    }

    openSearchPage() {
        if (this.props.navigation.getParam("query")) {
            NavigationManager.backToPreviousPage(this.props.navigation);
        } else {
            let mode = this.props.navigation.getParam("mode");
            if (mode && mode === products_mode.spot) {
                routeName = 'SearchProducts';
                params = {
                    mode: mode,
                };
            } else {
                routeName = 'SearchProducts';
                params = {
                    categoryId: this.props.navigation.getParam("categoryId"),
                    categoryName: this.props.navigation.getParam("categoryName"),
                };
            }
            if (this.props.isHome) {
                NavigationManager.openRootPage(this.props.navigation, routeName, params);
            } else {
                NavigationManager.openPage(this.props.navigation, routeName, params);
            }
        }
    }
}

export const styles = StyleSheet.create({
    bothLeftRight: {
        zIndex: 999,
    },
    qty: {
        position: 'absolute', right: -8, top: 3, height: 20, marginBottom: 2
    }
});
export default RightHeader;
