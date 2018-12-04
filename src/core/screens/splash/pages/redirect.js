import React from 'react';
import NavigationManager from '@helper/NavigationManager';
import { Linking } from 'react-native';
import Events from '@helper/config/events';
import Connection from '@base/network/Connection';
import firebase from 'react-native-firebase';
import { View } from 'react-native';
import md5 from 'md5';

export default class Redirect extends React.Component {

    requestGetDataFromURL(url) {
        Connection.restData();
        Connection.setGetData({
            url: url
        });
        Connection.connect('simiconnector/rest/v2/deeplinks', this, 'GET');
    }

    setData(data) {
        if (data) {
            let type = data.deeplink.type;
            switch (type) {
                case '1':
                    this.processOpenCategory(data.deeplink);
                    break;
                case '2':
                    this.processOpenProduct(data.deeplink);
                    break;
                default:
                    NavigationManager.openRootPage(this.props.navigation, 'Home');
                    break;
            }
        } else {
            NavigationManager.openRootPage(this.props.navigation, 'Home');
        }
    }

    processOpenCategory(data) {
        if (data.has_child == '1') {
            routeName = 'Category';
            params = {
                categoryId: data.id,
                categoryName: data.name,
            };
        } else {
            routeName = 'Products';
            params = {
                categoryId: data.id,
                categoryName: data.name,
            };
        }
        NavigationManager.openRootPage(this.props.navigation, routeName, params);
    }

    processOpenProduct(data) {
        NavigationManager.openRootPage(navigation, 'ProductDetail', {
            productId: data.id,
        });
    }

    componentWillMount() {
        Linking.getInitialURL().then((url) => {
            if (url) {
                if (!this.dispatchProcessAppLink(url, this.props.navigation)) {
                    let parts = url.split('?');
                    let params = parts[1].split('&');
                    let link = params[0].split('=')[1];
                    this.requestGetDataFromURL(link);
                }
            } else {
                firebase.links()
                    .getInitialLink()
                    .then((url) => {
                        if (url) {
                            this.requestGetDataFromURL(url);
                        } else {
                            NavigationManager.openRootPage(this.props.navigation, 'Home');
                        }
                    });
            }
        }).catch(err => {
            console.log('App link error occurred: ' + err);
            NavigationManager.openRootPage(this.props.navigation, 'Home');
        });
    }

    dispatchProcessAppLink(link, navigation) {
        let processed = true;
        for (let i = 0; i < Events.events.app_link.length; i++) {
            let node = Events.events.app_link[i];
            if (node.active === true) {
                let action = node.action;
                if (!action.processAppLink(link, navigation)) {
                    processed = false;
                }
            }
        }
        return processed;
    }

    dispatchAddRequests() {
        let plugins = [];
        for (let i = 0; i < Events.events.splash_requests.length; i++) {
            let node = Events.events.splash_requests[i];
            if (node.active === true) {
                let key = md5("splash_requests" + i);
                let Content = node.content;
                plugins.push(<Content obj={this} key={key} />);
            }
        }
        return plugins;
    }

    render() {
        return (
            <View>
                {this.dispatchAddRequests()}
            </View>
        );
    }
}
