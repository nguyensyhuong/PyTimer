import React from 'react';
import SimiComponent from '../../../core/base/components/SimiComponent';
import { Container } from 'native-base';
import PaypalExpressShippingModule from '../modules/shipping';

export default class PayPalExpressShipping extends SimiComponent {

    constructor(props) {
        super(props);
        this.isPage = true;
    }

    renderPhoneLayout() {
        console.log('2');
        return (
            <Container>
                <PaypalExpressShippingModule navigation={this.props.navigation} />
            </Container>
        );
    }

}