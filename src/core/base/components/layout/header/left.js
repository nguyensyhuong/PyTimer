import React from 'react';
import { View } from 'native-base';
import { Button, Left, Icon, Title, Badge, Text } from 'native-base';
import variable from "@theme/variables/material";
import Identify from '@helper/Identify';

class LeftHeader extends React.Component {
    render() {
        if (this.props.parent.props.back) {
            return (
                <View>
                    <Icon name={Identify.isRtl() ? "ios-arrow-forward" : 'ios-arrow-back'}
                        style={{ color: variable.toolbarBtnColor, padding: 7, fontSize: 23 }}
                        onPress={() => this.props.parent.goBack()} />
                </View>
            );
        } else {
            return (
                <View>
                    <Icon name="menu"
                        style={{ color: variable.toolbarBtnColor, padding: 7, fontSize: 23 }}
                        onPress={() => this.props.parent.props.navigation.openDrawer()} />
                </View>
            );
        }
    }
}
export default LeftHeader;
