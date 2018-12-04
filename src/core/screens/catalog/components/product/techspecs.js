import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, H3, Icon } from 'native-base';
import { TouchableOpacity, View } from 'react-native';
import NavigationManager from '@helper/NavigationManager';
import Identify from '@helper/Identify';
import styles from './styles';
import Events from '@helper/config/events';

export default class ProductTechSpecsComponent extends SimiComponent {

    tracking() {
        let params = {};
        params['event'] = 'product_action';
        params['action'] = 'selected_product_tech_specs';
        params['product_name'] = this.props.product.name;
        params['product_id'] = this.props.product.entity_id;
        params['sku'] = this.props.product.sku;
        Events.dispatchEventAction(params, this);
    }

    openTeachSpecs() {
        NavigationManager.openPage(this.props.navigation, 'TechSpecs', {
            additional: this.props.product.additional,
        });
    }

    renderPhoneLayout() {
        if (!Identify.isEmpty(this.props.product.additional)) {
            return (
                <TouchableOpacity onPress={() => {
                    this.openTeachSpecs();
                    this.tracking();
                }}>
                    <Card style={styles.card}>
                        <View style={styles.cardContainer}>
                            <H3 style={styles.title}>{Identify.__('Tech Specs')}</H3>
                            <Icon style={styles.extendIcon} name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                        </View>
                    </Card>
                </TouchableOpacity>
            );
        } else {
            return (null);
        }
    }

}
