import React from 'react';
import SimiComponent from '../../../../base/components/SimiComponent';
import { View } from 'react-native';
import { Icon } from 'native-base';
import styles from './styles';

export default class VerticalProductsBottom extends SimiComponent {
    render() {
        if(!this.props.parent.state.showBottom) {
            return (null);
        }
        let showList = this.props.parent.state.showList;
        let data = this.props.parent.state.data;
        let showFilter = false;
        if (data.layers) {
            if ((data.layers.layer_filter && data.layers.layer_filter.length > 0) || (data.layers.layer_state && data.layers.layer_state.length > 0)) {
                showFilter = true;
            }
        }
        let showSort = false;
        if (data.orders && data.orders.length > 0) {
            showSort = true;
        }
        return (
            <View style={styles.bottom}>
                <Icon name={(showList) ? 'md-grid' : 'md-list'} style={styles.icon} onPress={() => { this.props.parent.changeStyle() }} />
                {showFilter && <Icon name='md-funnel' style={styles.icon} onPress={() => { this.props.parent.openFilter() }} />}
                {showSort && <Icon name='md-swap' style={[styles.icon, { transform: [{ rotate: '90deg' }] }]} onPress={() => { this.props.parent.openSort() }} />}
            </View>
        );
    }
}