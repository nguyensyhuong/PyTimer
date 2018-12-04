import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { CheckBox, Text, Icon } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';

export default class TermCondition extends SimiComponent {

    constructor(props) {
        super(props);
        let data = Identify.getMerchantConfig().storeview.checkout.checkout_terms_and_conditions;
        if (!Identify.isEmpty(data)) {
            this.title = data.title;
            this.content = data.content;
        }
        this.state = {
            acceptedTerm: false
        }
    }

    acceptTerm() {
        this.props.parent.acceptTerm = !this.props.parent.acceptTerm;
        this.setState(previousState => ({ acceptedTerm: !previousState.acceptedTerm }));
    }

    renderPhoneLayout() {
        if (!this.title && !this.content) {
            this.props.parent.acceptTerm = true;
            return null;
        }
        return (
            <View style={{ padding: 10, borderTopWidth: 0.5, borderTopColor: '#EDEDED' }}>
                <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                    NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
                        html: this.content,
                    });
                }}>
                    <Text style={{ fontSize: 13, marginRight: 40 }} numberOfLines={3} ellipsizeMode={'tail'}>{this.content}</Text>
                    <Icon name={Identify.isRtl() ? 'ios-arrow-back-outline' : "ios-arrow-forward-outline"} style={{ position: 'absolute', right: 0, fontSize: 20 }} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}
                    onPress={() => this.acceptTerm()}>
                    <CheckBox color={'gray'}
                        checked={this.state.acceptedTerm}
                        style={{ width: 25, height: 25, left: 0 }}
                        onPress={() => this.acceptTerm()} />
                    <Text style={{ marginLeft: 10 }}>{Identify.__(this.title)}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
