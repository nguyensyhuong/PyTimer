import React from 'react';
import { Icon } from 'native-base';
import Identify from '../../core/helper/Identify';
import Connection from '../../core/base/network/Connection';
import { connect } from 'react-redux';
import NavigationManager from '../../../src/core/helper/NavigationManager';
import {wishlist_item} from '../constants'
class AddWishlist extends React.Component {
    constructor(props) {
        super(props);
        this.addedToWishlist = false;
        this.didRemoveProductFromWishlist = false;
        this.wishlistItemId = '';
    }

    wishlistButtonAction(){
        let isLogin = false;
        if (!Identify.isEmpty(this.props.customer_data)) {
            isLogin = true;
        }
        console.log(this.addedToWishlist);
        if(isLogin){
            console.log(this.addedToWishlist);
            if(this.addedToWishlist == true){
                this.removeProductFromWishlist();
            }else{
                this.addProductToWishlist();
            }
        }else{
            NavigationManager.openRootPage(this.props.navigation, "Login");
        }
    }

    removeProductFromWishlist(){
        this.props.storeData('showLoading', {type: 'dialog'});
        Connection.restData();
        Connection.connect(wishlist_item + '/' + this.wishlistItemId, this, 'DELETE');
    }

    addProductToWishlist(){
        this.props.storeData('showLoading', {type: 'dialog'});
        Connection.restData();
        Connection.setBodyData({"product":this.props.product.entity_id,"qty":"1"});
        Connection.connect(wishlist_item, this, 'POST');
    }

    setData(data){
        this.props.storeData('showLoading', {type: 'none'});
        if(data.wishlistitem){
            this.addedToWishlist = true;
            this.wishlistItemId = data.wishlistitem.wishlist_item_id;
        }else if(data.wishlistitems){
            this.didRemoveProductFromWishlist = true;
            this.addedToWishlist = false;
        }
        this.setState({});
    }

    handleWhenRequestFail() {
        this.props.storeData('showLoading', { type: 'none' });
    }

    render() {
        if(this.props.product && this.didRemoveProductFromWishlist == false){
            if(this.props.product.wishlist_item_id){
                this.wishlistItemId = this.props.product.wishlist_item_id;
                this.addedToWishlist = true;
            }
        }
        let color = "white";
        if(this.addedToWishlist == true){
            color = "red";
        }
        return (
            <Icon name="md-heart" style={{color: color}} onPress={() => { this.wishlistButtonAction() }} />
        );
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

export default connect(mapStateToProps,mapDispatchToProps)(AddWishlist);