import React from 'react';
import { Share, Platform } from 'react-native';
import { Icon } from 'native-base';
import simicart from '../../core/helper/simicart';

export default class SocialShare extends React.Component {
    constructor(props) {
        super(props);
        this.productName = ''
        this.productURL = '';
    }
    openShareDialog() {
        if (Platform.OS === 'ios') {
            Share.share({
                message: this.productName,
                url: this.productURL
            });
        } else {
            Share.share({
                message: this.productURL
            })
        }
    }
    initProductURL() {
        if (this.props.product) {
            let url = simicart.merchant_url;
            if (url.slice(-1) !== '/') {
                url = url + '/';
            }
            if (this.props.product.url_path && this.props.product.url_path != null && this.props.product.url_path != "") {
                this.productURL = url + this.props.product.url_path;
            } else {
                this.productURL = url + "catalog/product/view/id/" + this.props.product.entity_id;
            }
            this.productName = this.props.product.name
        }
    }
    render() {
        this.initProductURL();
        return (
            <Icon name="share" onPress={() => { this.openShareDialog() }} />
        );
    }
}