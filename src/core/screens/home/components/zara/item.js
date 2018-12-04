import React from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import styles from './styles'
import { View, Text } from "native-base";
import PropTypes from 'prop-types';

export default class Item extends React.Component {
    openPage(item) {
        if (item.has_children) {
            routeName = 'Category',
                params = {
                    categoryId: item.entity_id,
                    categoryName: item.name,
                };
        } else {
            routeName = 'Products',
                params = {
                    categoryId: item.entity_id,
                    categoryName: item.name,
                };
        }
        NavigationManager.openPage(this.props.navigation, routeName, params);
    }
    render() {
        if (this.props.item == null) return null;
        let item = this.props.item;
        return (
            <TouchableOpacity onPress={() => {
                this.openPage(item)
            }}>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <Text style={styles.content}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
Item.defaultProps = {
    item: null
}
