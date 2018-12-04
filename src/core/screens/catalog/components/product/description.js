import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, Text, Icon } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles';
import Events from '@helper/config/events';

export default class ProductDescriptionComponent extends SimiComponent {
    //params {event_action: 'product_action', property: 'action', value: 'selected_product_description'}

    openDescription() {
        NavigationManager.openPage(this.props.navigation, 'WebViewPage', {
            html: this.props.product.description,
        });
        let params = {};
        params['event'] = 'product_action';
        params['action'] = 'selected_product_description';
        params['product_name'] = this.props.product.name;
        params['product_id'] = this.props.product.entity_id;
        params['sku'] = this.props.product.sku;
        Events.dispatchEventAction(params, this);
    }

    renderDescriptionView(showDescription) {
        return (
            <TouchableOpacity onPress={() => { this.openDescription() }}>
                <Card style={styles.card}>
                    <View style={styles.cardContainer}>
                        <View style={{ flex: 1 }}>
                            <H3 style={styles.title}>{Identify.__('Description')}</H3>
                            <Text numberOfLines={3} style={styles.contentDescription}>{showDescription}</Text>
                        </View>
                        <Icon style={styles.extendIcon} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }

    renderPhoneLayout() {
        let showDescription = this.props.product.short_description;
        if (!showDescription) {
            showDescription = this.props.product.description;
        }
        return (
            this.renderDescriptionView(showDescription)
        );
    }
}
