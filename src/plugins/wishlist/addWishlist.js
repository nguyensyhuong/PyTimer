import React from 'react';
import { Icon } from 'native-base';
import Identify from '@helper/Identify';
import NewConnection from '@base/network/NewConnection';
import { connect } from 'react-redux';
import NavigationManager from '@helper/NavigationManager';
import { wishlist_item } from '../constants';
import Events from '@helper/config/events';

class AddWishlist extends React.Component {
    constructor(props) {
        super(props);
        this.addedToWishlist = false;
        this.didRemoveProductFromWishlist = false;
        this.wishlistItemId = '';
    }

    componentWillMount() {
        if (this.props.product && this.didRemoveProductFromWishlist == false && !Identify.isEmpty(this.props.customer_data)) {
            if (this.props.product.wishlist_item_id) {
                this.wishlistItemId = this.props.product.wishlist_item_id;
                this.addedToWishlist = true;
            }
        }
    }

    componentDidMount() {
        if (!Identify.isEmpty(this.props.customer_data)) {
            setTimeout(() => {
                this.checkInWishlist();
            }, 500);
        }
    }

    wishlistButtonAction() {
        let isLogin = false;
        if (!Identify.isEmpty(this.props.customer_data)) {
            isLogin = true;
        }
        console.log(this.addedToWishlist);
        if (isLogin) {
            console.log(this.addedToWishlist);
            if (this.addedToWishlist == true) {
                this.removeProductFromWishlist();
            } else {
                this.addProductToWishlist();
            }
        } else {
            NavigationManager.openPage(this.props.navigation, "Login");
        }
    }

    removeProductFromWishlist() {
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(wishlist_item + '/' + this.wishlistItemId, 'remove_product', this, 'DELETE')
            .connect();
    }

    addProductToWishlist() {
        this.tracking();
        this.props.storeData('showLoading', { type: 'dialog' });
        new NewConnection()
            .init(wishlist_item, 'remove_product', this, 'POST')
            .addBodyData({ "product": this.props.product.entity_id, "qty": "1" })
            .connect();
    }

    checkInWishlist() {
        new NewConnection()
            .init('simiconnector/rest/v2/checkwishlists/' + this.props.product.entity_id, 'check_in_wishlist', this)
            .connect();
    }

    setData(data, requestId) {
        this.props.storeData('showLoading', { type: 'none' });
        if (requestId == 'check_in_wishlist') {
            console.log(data)
            if(data.in_wishlist == true) {
                this.addedToWishlist = true;
                this.wishlistItemId = data.wishlist_item_id;
            } else {
                this.addedToWishlist = false;
            }
        } else {
            console.log(data);
            if (data.wishlistitem) {
                this.addedToWishlist = true;
                this.wishlistItemId = data.wishlistitem.wishlist_item_id;
            } else if (data.wishlistitems) {
                this.didRemoveProductFromWishlist = true;
                this.addedToWishlist = false;
            }
        }
        this.setState({});
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    render() {
        let color = "white";
        if (this.addedToWishlist == true) {
            color = "red";
        }
        return (
            <Icon name="md-heart" style={{ color: color }} onPress={() => { this.wishlistButtonAction() }} />
        );
    }

    tracking() {
        let data = {};
        data['event'] = 'product_action';
        data['action'] = 'added_to_wishlist';
        data['product_name'] = this.props.product.name;
        data['product_id'] = this.props.product.entity_id;
        data['sku'] = this.props.product.sku;
        data['qty'] = '1';
        Events.dispatchEventAction(data, this);
    }
}

const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
        dashboard_configs: state.redux_data.dashboard_configs,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWishlist);