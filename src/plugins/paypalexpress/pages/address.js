import React from 'react';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Container } from 'native-base';
import PaypalExpressAddressModule from '../modules/address';

export default class PayPalExpressAddress extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isRight = false;
    }

    renderPhoneLayout() {
        return (
            <Container>
                <PaypalExpressAddressModule navigation={this.props.navigation} />
            </Container>
        );
    }

}