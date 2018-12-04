import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Card, CardItem, Text, H3 } from 'native-base';
import Identify from '@helper/Identify';
import styles from './detailStyles';

export default class OrderShipping extends SimiComponent {

    renderName(item) {
        let name = '';
        if (item.prefix !== undefined && item.prefix !== null && item.prefix !== '') {
            name += item.prefix + ' ';
        }

        if (item.firstname !== undefined && item.firstname !== null && item.firstname !== '') {
            name += item.firstname + ' ';
        }

        if (item.lastname !== undefined && item.lastname !== null && item.lastname !== '') {
            name += item.lastname + ' ';
        }

        if (item.suffix !== undefined && item.suffix !== null && item.suffix !== '') {
            name += item.suffix;
        }
        return name;
    }

    renderCompany(item) {
        let company = '';
        if (item.company !== undefined && item.company !== null && item.company !== '') {
            company = item.company
        }
        return company;
    }

    renderStreet(item) {
        let street = '';
        if (item.street !== undefined && item.street !== null && item.street !== '') {
            street = item.street
        }
        return street;
    }

    renderCityStatePostCode(item) {
        let info = '';
        if (item.city !== undefined && item.city !== null && item.city !== '') {
            info = item.city + ', ';
        }
        if (item.region !== undefined && item.region !== null && item.region !== '') {
            info = item.region + ', ';
        }
        if (item.postcode !== undefined && item.postcode !== null && item.postcode !== '') {
            info = item.postcode;
        }
        return info;
    }

    renderCountry(item) {
        let country = '';
        if (item.country_name !== undefined && item.country_name !== null && item.country_name !== '') {
            country = item.country_name;
        }
        return country;
    }

    renderPhone(item) {
        let telephone = '';
        if (item.telephone !== undefined && item.telephone !== null && item.telephone !== '') {
            telephone = item.telephone;
        }
        return telephone;
    }

    renderEmail(item) {
        let email = '';
        if (item.email !== undefined && item.email !== null && item.email !== '') {
            email = item.email;
        }
        return email;
    }

    renderPhoneLayout() {
        let address = this.props.order.shipping_address;
        return (
            <Card style={{ flex: 1 }} key={'shipping'}>
                <H3 style={{ width: '100%', backgroundColor: '#EDEDED', paddingLeft: 15, paddingRight: 10, paddingTop: 10, paddingBottom: 10 }}>{Identify.__('SHIP TO')}</H3>
                <CardItem style={styles.address}>
                    <Text>{this.renderName(address)}</Text>
                    <Text>{this.renderCompany(address)}</Text>
                    <Text>{this.renderStreet(address)}</Text>
                    <Text>{this.renderCityStatePostCode(address)}</Text>
                    <Text>{this.renderCountry(address)}</Text>
                    <Text>{this.renderPhone(address)}</Text>
                    <Text>{this.renderEmail(address)}</Text>
                </CardItem>
                <CardItem>
                    <Text style={styles.title}>{Identify.__(this.props.order.shipping_method)}</Text>
                </CardItem>
            </Card>
        );
    }
}