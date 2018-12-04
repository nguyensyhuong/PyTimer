import React from 'react';
import { Container, Content, Text, Button, View, Input, Item, Toast, ActionSheet } from 'native-base';
import { StyleSheet, Keyboard, ScrollView, RefreshControl, Image } from 'react-native';
import md5 from 'md5';
import SimiPageComponent from "@base/components/SimiPageComponent";
import Connection from "@base/network/Connection";
import { quoteitems } from '@helper/constants';
import Identify from '@helper/Identify';
import Total from '@screens/checkout/components/totals';
import variable from "@theme/variables/material";
import { connect } from 'react-redux';
import Layout from '@helper/config/layout';
import Events from '@helper/config/events';

class Cart extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            refreshing: false,
         };
        this.list = null;
        this.totals = null;
        this.useDiffLayoutForHorizontal = true;
        this.from = 'cart';
        this.is_go_detail = true;
        this.isRight = false;
    }
    renderLayout(content, position = null) {
        this.list = this.props.data.quoteitems.length > 0 ? this.props.data.quoteitems : null;
        this.totals = this.props.data.total;
        let contents = Layout.layout.cart_layout[content];
        let components = [];
        for (let i = 0; i < contents.length; i++) {
            let element = contents[i];
            if (element.active == true) {
                let key = md5(content + "_cart" + i);
                if (position == 'left') {
                    if (element.left) {
                        let Content = element.content;
                        components.push(<Content
                            parent={this}
                            navigation={this.props.navigation}
                            key={key}
                            {...element.data}
                        />);
                    }
                } else if (position == 'right') {
                    if (!element.left) {
                        let Content = element.content;
                        components.push(<Content
                            parent={this}
                            navigation={this.props.navigation}
                            key={key}
                            {...element.data}
                        />);
                    }
                } else {
                    let Content = element.content;
                    components.push(<Content
                        parent={this}
                        navigation={this.props.navigation}
                        key={key}
                        {...element.data}
                    />);
                }
            }
        };
        return components;
    }
    componentWillMount() {
        if (this.props.loading.type === 'none' && Identify.isEmpty(this.props.data)) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }
    componentDidMount() {
        Connection.restData();
        if (Identify.isEmpty(this.props.data)) {
            Connection.connect(quoteitems, this, 'GET');
        }
    }
    setData(data) {
        if (data.message) {
            let messages = data.message;
            let message = messages[0];
            Keyboard.dismiss();
            Toast.show({
                text: message,
                duration: 3000
            });
        }
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'quoteitems', data: data }
        ]);
    }
    qtyHandle(e) { return; }
    updateCart(item_id, qty) {
        this.props.storeData('showLoading', { type: 'dialog' });
        Connection.restData();
        if (!Identify.isEmpty(this.props.data) && this.props.data.quote_id != null) {
            let params = [];
            params['quote_id'] = this.props.data.quote_id;
            Connection.setGetData(params);
        }
        let json = {};
        json[item_id] = qty;
        let data = {};
        data['event'] = 'cart_action';
        data['action'] = 'update_cart';
        data['item_id'] = item_id;
        data['qty'] = qty;
        Events.dispatchEventAction(data, this);

        Connection.setBodyData(json);
        Connection.connect(quoteitems, this, 'PUT');
    }
    qtySubmit(e, item_id, default_qty) {
        if (e.nativeEvent.text && e.nativeEvent.text != default_qty.toString()) {
            this.updateCart(item_id, e.nativeEvent.text);
        } else {
            e.nativeEvent.text = default_qty.toString();
        }
    }
    refreshControl() {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                tintColor={variable.defaultSpinnerColor}
                onRefresh={() => this.refreshListView()} />
        )
    }
    refreshListView() {
        //Start Rendering Spinner
        this.setState({ refreshing: true });
        Connection.restData();
        if (!Identify.isEmpty(this.props.data.quoteitems) && this.props.data.quote_id != null) {
            let params = [];
            params['quote_id'] = this.props.data.quote_id;
            Connection.setGetData(params);
            Connection.connect(quoteitems, this, 'GET');
            this.props.storeData('showLoading', { type: 'full' });
        }
        this.setState({ refreshing: false }); //Stop Rendering Spinner
    }
    renderPhoneLayout() {
        if (Identify.isEmpty(this.props.data)) {
            return (null);
        }
        let items = this.props.data.quoteitems;
        if (items.length <= 0) {
            return (
                <Container style={{backgroundColor: variable.appBackground}}>
                    <Content refreshControl={this.refreshControl()}>
                        <Text style={{ textAlign: 'center', marginTop: 90 }}>{Identify.__('You have no items in your shopping cart')}</Text>
                    </Content>
                </Container>
            );
        }
        return (
            <Container style={{ position: 'relative', backgroundColor: variable.appBackground }}>
                <Content refreshControl={this.refreshControl()} style={{ marginBottom: 30, paddingBottom: 60 }}>
                    {this.renderLayout('content')}
                </Content>
                {this.renderLayout('container')}
            </Container>
        )
    }
    renderTabletHorizontalLayout() {
        if (Identify.isEmpty(this.props.data)) {
            return (null);
        }

        let items = this.props.data.quoteitems;
        if (items.length <= 0) {
            return (
                <Container style={{backgroundColor: variable.appBackground}}>
                    <Content refreshControl={this.refreshControl()}>
                        <Text style={{ textAlign: 'center', marginTop: 90 }}>{Identify.__('You have no items in your shopping cart')}</Text>
                    </Content>
                </Container>
            );
        }
        return (
            <Container style={{ flex: 3, flexDirection: 'row', backgroundColor: variable.appBackground }}>
                <View style={{ flex: 2 }}>
                    <Content refreshControl={this.refreshControl()}>
                        {this.renderLayout('content', 'left')}
                    </Content>
                </View>
                <View style={{ flex: 1 }}>
                    <Content>
                        {this.renderLayout('content', 'right')}
                    </Content>
                    {this.renderLayout('container')}
                </View>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.redux_data.showLoading,
        data: state.redux_data.quoteitems
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
