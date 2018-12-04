import React from 'react';
import SimiComponent from "../../../../base/components/SimiComponent";
import { ListItem, Left, Right, Icon, Text } from "native-base";
import NavigationManager from '../../../../helper/NavigationManager';
import Identify from '@helper/Identify';

class CategoriesItem extends SimiComponent{
    openCategory = (category) => {
        if (category.has_children) {
            routeName = 'Category',
                params = {
                    categoryId: category.entity_id,
                    hasChild: category.has_children,
                    categoryName: category.name,
                };
        } else {
            routeName = 'Products',
                params = {
                    categoryId: category.entity_id,
                    categoryName: category.name,
                };
        }
        NavigationManager.openPage(this.props.navigation, routeName, params);
        // comment
    };
    render(){
        let item = this.props.item;
        return(
            <ListItem onPress={() => { this.openCategory(item) }}>
                <Left>
                    <Text>{item.name}</Text>
                </Left>
                <Right>
                    <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                </Right>
            </ListItem>
        )
    }
}
export default CategoriesItem;