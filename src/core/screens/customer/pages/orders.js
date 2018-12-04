import React from 'react';
import { connect } from 'react-redux';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { order_history } from '@helper/constants';
import Connection from '@base/network/Connection';
import { Container } from 'native-base';
import variable from '@theme/variables/material';

class OrdersPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            data: null,
            loadMore: true
        };
        this.limit = 10;
        this.offset = 0;
        this.lastY = 0;
        this.isLoadingMore = false;
    }

    componentWillMount() {
        if (this.props.showLoading.type === 'none' && !this.checkExistData()) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (!this.state.data) {
            this.requestData(this.createParams());
        }
    }

    checkExistData() {
        if (this.props.data.orders !== undefined) {
            if (this.props.data.orders.length % this.limit == 0) {
                this.offset = (~~(this.props.data.orders.length / this.limit) - 1) * this.limit;
            } else {
                this.offset = (~~(this.props.data.orders.length / this.limit)) * this.limit;
            }

            let data = this.props.data;
            let canLoadMore = true;
            if (this.offset + this.limit >= data.total) {
                canLoadMore = false;
            }
            this.setState({ data: data, loadMore: canLoadMore });
            return true;
        }
        return false;
    }

    createParams() {
        let params = [];
        params['limit'] = this.limit;
        params['offset'] = this.offset;
        params['order'] = 'entity_id';
        params['dir'] = 'desc';
        return params;
    }

    requestData(params) {
        Connection.restData();
        Connection.setGetData(params);
        Connection.connect(order_history, this, 'GET');
    }

    setData(data) {
        if (this.state.data) {
            let combinedOrders = this.state.data.orders;
            combinedOrders.push.apply(combinedOrders, data.orders);
            data.orders = combinedOrders;

            let combinedIds = this.state.data.all_ids;
            combinedIds.push.apply(combinedIds, data.all_ids);
            data.all_ids = combinedIds;
        }
        this.state.data = data;
        let canLoadMore = true;
        if (this.offset + this.limit >= data.total) {
            canLoadMore = false;
        }
        this.state.loadMore = canLoadMore;
        this.isLoadingMore = false;
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'order_history_data', data: data }
        ]);
    }

    onEndReached = () => {
        if (this.offset + this.limit < this.state.data.total && !this.isLoadingMore) {
            this.isLoadingMore = true;
            this.offset += this.limit;
            this.requestData(this.createParams());
        }
    }

    shouldRenderLayoutFromConfig() {
        if (this.state.data) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element) {
        return {
            orders: this.state.data.orders
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{backgroundColor: variable.appBackground}}>
                {this.renderLayoutFromConfig('orders_layout', 'container')}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.order_history_data, showLoading: state.redux_data.showLoading };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrdersPage);