import React from 'react';
import { FlatList, View } from 'react-native';
import Item from './item';

export default class Row extends React.Component {
    constructor(props) {
        super(props);
    }

    renderRowItem = (item, index) => {
        return <Item item={item} index={index} listSize={this.props.items.length} />
    }

    render() {
        let items = this.props.items;
        if (items.length > 0){
            return (
                <View>
                    <FlatList
                        style={{ marginTop: 5 }}
                        data={items}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.item_id}
                        renderItem={({ item, index }) =>
                            this.renderRowItem(item, index)
                        } />
                </View>
            );
        }
        return null;
    }
}
