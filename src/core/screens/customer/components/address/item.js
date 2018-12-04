import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { TouchableOpacity, Alert } from 'react-native';
import { Card, CardItem, Text, Button, Icon } from 'native-base';
import Identify from '@helper/Identify';

export default class AddressItem extends SimiComponent {

    constructor(props) {
        super(props);
        this.addressItem = this.props.address;
    }

    showDeleteItemPopup(data) {
        Alert.alert(
            Identify.__('Warning'),
            Identify.__('Are you sure you want to delete this item?'),
            [
                { text: Identify.__('Cancel'), onPress: () => { style: 'cancel' } },
                {
                    text: Identify.__('OK'), onPress: () => {
                        this.props.parent.deleteAddress(this.addressItem.entity_id);
                    }
                },
            ],
            { cancelable: true }
        );
    }

    renderName() {
        let name = '';
        if (this.addressItem.prefix !== undefined && this.addressItem.prefix !== null && this.addressItem.prefix !== '') {
            name += this.addressItem.prefix + ' ';
        }

        if (this.addressItem.firstname !== undefined && this.addressItem.firstname !== null && this.addressItem.firstname !== '') {
            name += this.addressItem.firstname + ' ';
        }

        if (this.addressItem.lastname !== undefined && this.addressItem.lastname !== null && this.addressItem.lastname !== '') {
            name += this.addressItem.lastname + ' ';
        }

        if (this.addressItem.suffix !== undefined && this.addressItem.suffix !== null && this.addressItem.suffix !== '') {
            name += this.addressItem.suffix;
        }

        if (name !== '') {
            return <Text>{name}</Text>
        }
    }

    renderCompany() {
        let company = '';
        if (this.addressItem.company !== undefined && this.addressItem.company !== null && this.addressItem.company !== '') {
            company = this.addressItem.company
        }
        if (company !== '') {
            return <Text>{company}</Text>
        }
    }

    renderStreet() {
        let street = '';
        if (this.addressItem.street !== undefined && this.addressItem.street !== null && this.addressItem.street !== '') {
            street = this.addressItem.street
        }
        if (street !== '') {
            return <Text>{street}</Text>
        }
    }

    renderCityStatePostCode() {
        let info = '';
        if (this.addressItem.city !== undefined && this.addressItem.city !== null && this.addressItem.city !== '') {
            info = this.addressItem.city + ', ';
        }
        if (this.addressItem.region !== undefined && this.addressItem.region !== null && this.addressItem.region !== '') {
            info = this.addressItem.region + ', ';
        }
        if (this.addressItem.postcode !== undefined && this.addressItem.postcode !== null && this.addressItem.postcode !== '') {
            info = this.addressItem.postcode;
        }
        if (info !== '') {
            return <Text>{info}</Text>
        }
    }

    renderCountry() {
        let country = '';
        if (this.addressItem.country_name !== undefined && this.addressItem.country_name !== null && this.addressItem.country_name !== '') {
            country = this.addressItem.country_name;
        }
        if (country !== '') {
            return <Text>{country}</Text>
        }
    }

    renderPhone() {
        let telephone = '';
        if (this.addressItem.telephone !== undefined && this.addressItem.telephone !== null && this.addressItem.telephone !== '') {
            telephone = this.addressItem.telephone;
        }
        if (telephone !== '') {
            return <Text>{telephone}</Text>
        }
    }

    renderEmail() {
        let email = '';
        if (this.addressItem.email !== undefined && this.addressItem.email !== null && this.addressItem.email !== '') {
            email = this.addressItem.email;
        }
        if (email !== '') {
            return <Text>{email}</Text>
        }
    }

    onChooseAddress() {
        this.props.parent.onSelectAddress(this.addressItem);
    }

    renderPhoneLayout() {
        return (
            <TouchableOpacity onPress={() => {this.onChooseAddress()}}>
                <Card>
                    <CardItem style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                        {this.renderName()}
                        {this.renderCompany()}
                        {this.renderStreet()}
                        {this.renderCityStatePostCode()}
                        {this.renderCountry()}
                        {this.renderPhone()}
                        {this.renderEmail()}
                    </CardItem>
                    {!this.props.parent.mode.includes('checkout') && <Button style={{ position: 'absolute', top: 0, right: 0 }} transparent
                        onPress={() => { this.showDeleteItemPopup() }}>
                        <Icon name="ios-trash" />
                    </Button>}
                </Card>
            </TouchableOpacity>
        );
    }
}