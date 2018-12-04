import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { ScrollView, View, Linking } from 'react-native';
import { List, ListItem, Left, Body, Right, Thumbnail, Button, Text, Spinner, Icon } from 'native-base';
import NavigationManager from '@helper/NavigationManager';

export default class StoreList extends SimiComponent {

    constructor(props) {
        super(props);
        this.lastY = 0;
        this.isLoadingMore = false;
    }

    loadMore() {
        if (this.props.parent.offset + this.props.parent.limit < this.props.data.total && this.isLoadingMore == false) {
            this.props.parent.offset += this.props.parent.limit;
            this.isLoadingMore = true;
            this.props.parent.connectApi(true);
        }
    }

    renderItemStore(item) {
        let image = item.image ? <Thumbnail resizeMode='stretch' square source={{ uri: item.image }} /> : <Thumbnail resizeMode='stretch' source={require('../../../media/logo.png')} />
        return (
            <ListItem thumbnail>
                <Left>
                    {image}
                </Left>
                <Body style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <Text>{item.name}</Text>
                    <Text note>{item.address + ' ' + item.city + ' ' + item.country}</Text>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {this.renderPhoneItem(item)}
                        {this.renderEmailItem(item)}
                    </View>
                </Body>
                <Right>
                    <Text note numberOfLines={1} style={{ position: 'absolute', top: 20, right: 30 }}>{parseInt(item.distance / 1000) + ' ' + 'km'}</Text>
                    <Button transparent primary onPress={() => { NavigationManager.openPage(this.props.navigation, 'StoreLocatorDetail', { item_data: item }) }}>
                        <Text>View</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }

    renderPhoneItem(item) {
        if (item.phone) {
            return (
                <Button transparent primary onPress={() => Linking.openURL(`tel::${item.phone}`).catch(err => console.log(err))}>
                    <Icon name='md-call' />
                </Button>
            )
        }
        return null;
    }

    renderEmailItem(item) {
        if (item.phone) {
            return (
                <Button transparent primary onPress={() => Linking.openURL(`mailto:${item.email}`).catch(err => console.log(err))}>
                    <Icon name='md-mail' />
                </Button>
            )
        }
        return null;
    }

    renderPhoneLayout() {
        this.isLoadingMore = false;
        let canLoadMore = true;
        if (this.props.parent.offset + this.props.parent.limit >= this.props.data.total) {
            canLoadMore = false;
        }
        return (
            <ScrollView onScroll={({ nativeEvent }) => {
                this.lastY = nativeEvent.contentOffset.y;
                if ((Number((nativeEvent.contentSize.height).toFixed(0)) - 1) <= Number((nativeEvent.contentOffset.y).toFixed(1)) + Number((nativeEvent.layoutMeasurement.height).toFixed(1))) {
                    this.loadMore();
                }
            }}
                scrollEventThrottle={400}>
                <List dataArray={this.props.data.storelocations}
                    renderRow={(item) => this.renderItemStore(item)
                    }>
                </List>
                <Spinner style={canLoadMore ? {} : { display: 'none' }} />
            </ScrollView>
        );
    }
}