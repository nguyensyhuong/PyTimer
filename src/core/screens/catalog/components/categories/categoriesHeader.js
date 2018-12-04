import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { View } from 'react-native';
import { Text, H3 } from "native-base";
import Identify from '../../../../helper/Identify';
import NavigationManager from '../../../../helper/NavigationManager';
import styles from './styles'

class CategoriesHeader extends SimiComponent {

    onClickViewAll() {
        NavigationManager.openPage(this.props.navigation, 'Products', {
            categoryId: this.props.parent.props.navigation.getParam("categoryId"),
            categoryName: this.props.parent.cateName,
        });
    }

    renderViewAll() {
        return (
            <View style={styles.top}>
                <H3 numberOfLines={1} ellipsizeMode='tail' style={styles.cateNameWithViewAll}>{this.props.parent.cateName}</H3>
                <Text numberOfLines={1} style={styles.viewAll} onPress={() => { this.onClickViewAll() }}>{Identify.__('View All')}</Text>
            </View>
        );
    }

    renderCateName() {
        return (
            <View>
                <H3 numberOfLines={1} ellipsizeMode='tail' style={styles.cateName}>{this.props.parent.cateName}</H3>
            </View>
        );
    }

    render() {
        if (this.props.parent.showViewAll) {
            return (
                this.renderViewAll()
            );
        } else {
            return (
                this.renderCateName()
            );
        }
    }
}
export default CategoriesHeader;