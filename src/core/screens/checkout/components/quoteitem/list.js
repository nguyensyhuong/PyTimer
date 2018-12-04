import React from 'react';
import { FlatList } from 'react-native';
import Identify from '@helper/Identify';
import { View, Text, H3 } from 'native-base';
import material from '@theme/variables/material';
import QuoteItem from './item';

class ListItems extends React.Component {
    constructor(props) {
        super(props);
    }
    
    generatePropsFlatlist(list){
        return{
            data: list,
            extraData : this.props.parent.list,
            showsVerticalScrollIndicator: false
        }
    }
    render() {
        let list = this.props.list ? this.props.list : this.props.parent.list;
        if (list) {
            return (
                <View>
                    {this.props.from == 'checkout' && <Text style={{ fontFamily: material.fontBold, width: '100%', backgroundColor: material.sectionColor, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__('Shipment Details')}</Text>}
                    {this.props.from == 'order_detail' && <H3 style={{ width: '100%', backgroundColor: '#EDEDED', paddingLeft: 15, paddingRight: 10, paddingTop: 10, paddingBottom: 10, textAlign: 'left' }}>{Identify.__('ITEMS')}</H3>}
                    <FlatList
                        {...this.generatePropsFlatlist(list)}
                        keyExtractor={(item) => item.item_id}
                        renderItem={({ item }) =>
                            <QuoteItem data={item} parent={this.props.parent} />
                        } />
                </View>
            );
        }
        return null;
    }
}

ListItems.defaultProps = {
    is_go_detail: false,
    from: null
};

export default ListItems;
