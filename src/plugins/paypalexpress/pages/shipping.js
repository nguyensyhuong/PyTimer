import React from 'react';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { Container } from 'native-base';
import PaypalExpressShippingModule from '../modules/shipping';

export default class PayPalExpressShipping extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isRight = false;
    }

    renderPhoneLayout() {
        return (
            <Container>
                <PaypalExpressShippingModule navigation={this.props.navigation} />
            </Container>
        );
    }

}