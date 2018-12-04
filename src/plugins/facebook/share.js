import React from 'react';
import { Icon } from 'native-base';
import {ShareDialog} from 'react-native-fbsdk';
import simicart from '../../core/helper/simicart';

export default class AddFBShare extends React.Component {
    constructor(props) {
        super(props);
    }
    openShareDialog() {
        var tmp = this;
        ShareDialog.canShow(this.shareLinkContent)
            .then(function (canShow) {
                if (canShow) {
                    return ShareDialog.show(tmp.shareLinkContent);
                }
            })
            .then(
                function (result) {
                    if (result.isCancelled) {
                        alert('Share cancelled');
                    } else {
                        alert('Share success');
                    }
                },
                function (error) {
                    alert('Share fail with error: ' + error);
                },
            );
    }
    initProductURL() {
        if (this.props.product) {
            let url = simicart.merchant_url;
            if (url.slice(-1) !== '/') {
                url = url + '/';
            }
            url = url + this.props.product.url_path;
            this.shareLinkContent = {
                contentType: 'link',
                contentUrl: url,
            };
        }
    }
    render() {
        this.initProductURL();
        return (
            <Icon name="logo-facebook" onPress={() => { this.openShareDialog() }} />
        );
    }
}