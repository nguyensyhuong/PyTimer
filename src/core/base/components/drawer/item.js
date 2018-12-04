import React from 'react';
import variable from '@theme/variables/material';
import { View } from 'react-native';
import { Icon, Text, ListItem, Thumbnail, Right } from 'native-base';
import Language from '../language/index';
import Events from '@helper/config/events';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';

export default class MenuLeftItem extends React.Component {
    getConfigData(keyBase){
        let config = Identify.getMerchantConfig().storeview.base;
        return config[keyBase]
    }
    tracking() {
        let params = {};
        params['event'] = 'menu_action';
        params['action'] = 'clicked_menu_item';
        params['menu_item_name'] = this.props.data.key;
        Events.dispatchEventAction(params);
    }

    onSelectItem() {
        this.tracking();
        if (this.props.data.hasOwnProperty('onClick')) {
            this.props.data.onClick();
        } else {
            if (this.props.data.key == 'item_home') {
                NavigationManager.backToRootPage(this.props.navigation);
            } else {
                NavigationManager.openRootPage(this.props.navigation, this.props.data.route_name, this.props.data.params ? this.props.data.params : {});
            }
        }
    }

    renderItem() {
        const textColor = variable.menuLeftTextColor;
        return (
            <ListItem last
                      button
                      onPress={() => { this.onSelectItem() }}
                      style={{ borderBottomColor: variable.menuLeftLineColor }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.props.data.icon && <Icon name={this.props.data.icon} style={{ color: variable.menuLeftIconColor, fontSize: 30, width: 30 }} />}
                    {this.props.data.hasOwnProperty('image') && <Thumbnail
                        square
                        source={this.props.data.image != '' ? { uri: this.props.data.image } : {}}
                        style={{ width: 30, height: 30 }} />}
                    <Text style={{ marginLeft: 15, color: textColor }}>{this.props.data.label}{this.props.data.hasDescrible && <Text style={{color: textColor }}>: {this.getConfigData(this.props.data.keyConfig)}</Text>}</Text>
                </View>
                {this.props.data.is_extend && <Right>
                    <Icon style={{ color: variable.menuLeftTextColor, fontSize: 20 }} name={Identify.isRtl() ? 'ios-arrow-back-outline' : "ios-arrow-forward-outline"} />
                </Right>}
            </ListItem>
        );
    }

    renderMore() {
        return (
            <View style={{ backgroundColor: variable.listBorderColor, height: 50 }}>
                <Language text="MORE" style={{ fontSize: variable.textSizeSmall, padding: 10, paddingTop: 15, textAlign: 'left' }} />
            </View>
        );
    }

    render() {
        if (this.props.data.hasOwnProperty('is_separator') && this.props.data.is_separator) {
            return (
                <View>
                    {this.renderMore()}
                </View>
            );
        } else {
            return (
                <View>
                    {this.renderItem()}
                </View>
            );
        }
    }
}