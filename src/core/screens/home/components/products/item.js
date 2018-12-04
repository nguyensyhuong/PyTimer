import React from 'react';
import styles from '../../pages/styles';
import { View, H3 } from "native-base";
import HorizontalProducts from '../../../catalog/components/horizontalProducts';

export default class Item extends React.Component{
    render(){
        if(this.props.item == null) return null;
        return (
            <View>
                <H3 style={styles.title}>{this.props.item.list_title.toUpperCase()}</H3>
                <HorizontalProducts hasData={true} products={this.props.item.product_array.products} navigation={this.props.navigation} fromHome={true} />
            </View>
        );
    }
}
Item.defaultProps = {
    item: null
}
