import React from 'react';
import { Share } from 'react-native';
import { Icon } from 'native-base';
import simicart from '../../core/helper/simicart';

export default class SocialShare extends React.Component {
    constructor(props) {
        super(props);
        this.productURL = '';
    }
    openShareDialog() {
        Share.share({
            message: this.productURL
        });
    }
    initProductURL() {
        if (this.props.product) {
            let url = simicart.merchant_url;
            if (url.slice(-1) !== '/') {
                url = url + '/';
            }
            this.productURL = url + this.props.product.url_path;
        }
    }
    render() {
        this.initProductURL();
        return (
            <Icon name="share" onPress={() => { this.openShareDialog() }} />
        );
    }
}