import React from 'react';
import SimiComponent from '../../../core/base/components/SimiComponent';
import { Container } from 'native-base';
import PaypalExpressAddressModule from '../modules/address';

export default class PayPalExpressAddress extends SimiComponent {

    constructor(props) {
        super(props);
        this.isPage = true;
    }

    renderPhoneLayout() {
        return (
            <Container>
                <PaypalExpressAddressModule navigation={this.props.navigation} />
            </Container>
        );
    }

}