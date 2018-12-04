import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { View } from 'react-native';
import { Container, Content } from 'native-base';
import Connection from '@base/network/Connection';
import { order_history, quoteitems } from '@helper/constants';
import variable from '@theme/variables/material';

class OrderPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.getParam('orderId');
        this.state = {
            ...this.state,
            order: this.props.navigation.getParam('order')
        }
        this.isReorder = false;
        this.isUpdateCart = false;
    }

    componentDidMount() {
        if (this.orderId) {
            this.getOrder();
        }
    }

    getOrder = () => {
        this.props.storeData('showLoading', { type: 'full' });
        Connection.restData();
        Connection.connect(order_history + '/' + this.orderId, this, 'GET');
    }

    setData(data) {
        if (this.isReorder) {
            this.isReorder = false;
            this.requestUpdateCart();
        } else if (this.isUpdateCart) {
            this.props.storeData('actions', [
                { type: 'showLoading', data: { type: 'none' } },
                { type: 'quoteitems', data: data }
            ]);
            this.isUpdateCart = false;
        } else {
            this.props.storeData('showLoading', { type: 'none' });
            this.setState(
                { order: data.order }
            );
        }
    }

    onReorder() {
        this.props.storeData('showLoading', { type: 'dialog' });
        Connection.restData();
        Connection.setGetData({ reorder: '1' });
        Connection.connect(order_history + '/' + this.orderId, this, 'GET');
        this.isReorder = true;
    }

    requestUpdateCart() {
        Connection.restData();
        Connection.connect(quoteitems, this, 'GET');
        this.isUpdateCart = true;
    }

    shouldRenderLayoutFromConfig() {
        if (this.state.order) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            order: this.state.order
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{backgroundColor: variable.appBackground}}>
                <Content>
                    <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, paddingTop: 10, paddingBottom: 60 }}>
                        {this.renderLayoutFromConfig('order_detail_layout', 'content')}
                    </View>
                </Content>
                {this.renderLayoutFromConfig('order_detail_layout', 'container')}
            </Container>
        );
    }
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(null, mapDispatchToProps)(OrderPage);