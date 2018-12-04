import React from 'React';
import SimiPageComponent from '@base/components/SimiPageComponent';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { Container, Content } from 'native-base';
import Connection from '@base/network/Connection';
import NavigationManager from '@helper/NavigationManager';
import variable from '@theme/variables/material';
import { addresses, address_detail_mode, checkout_mode } from "@helper/constants";

class AddressDetailPage extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.mode = this.props.navigation.getParam('mode');
        this.address = this.props.navigation.getParam('address') ? this.props.navigation.getParam('address') : {};
        this.onSaveShippingAddress = this.props.navigation.getParam('onSaveShippingAddress');
        this.onSaveBillingAddress = this.props.navigation.getParam('onSaveBillingAddress');
        this.state = {
            ...this.state,
            buttonEnabled: Object.keys(this.address).length == 0 ? false : true
        };
        if (this.mode.includes('checkout')) {
            this.isRight = false;
        }
    }

    updateButtonStatus(status) {
        if (status != this.state.buttonEnabled) {
            this.setState({ buttonEnabled: status });
        }
    }

    editNewAddress = () => {
        this.addressData = this.form.getAddressData();
        let countryStateData = this.addressData.country_state;
        delete this.addressData.country_state;
        this.addressData = {
            ...this.addressData,
            ...countryStateData
        }

        if (this.mode.includes('checkout')) {
            if (this.mode.includes('add_new')) {
                if (this.mode.includes('exist_customer')) {
                    this.props.storeData('showLoading', { type: 'dialog' });
                    Connection.restData();
                    Connection.setBodyData(this.addressData);
                    Connection.connect(addresses, this, 'POST');
                } else {
                    if (this.addressData.password !== this.addressData.confirm_password) {
                        Alert.alert(
                            'Error',
                            Identify.__('Password and Confirm password don\'t match'),
                        );
                        return;
                    }

                    let checkoutMode = '';
                    if (this.mode == address_detail_mode.checkout.as_new_customer.add_new) {
                        checkoutMode = checkout_mode.new_customer;
                    } else {
                        checkoutMode = checkout_mode.guest;
                    }
                    NavigationManager.openPage(this.props.navigation, 'Checkout', {
                        mode: checkoutMode,
                        shippingAddressParams: this.addressData,
                        billingAddressParams: this.addressData
                    });
                }
            } else if (this.mode.includes('edit')) {
                let step = 1;
                if (this.mode.includes('exist_customer')) {
                    step = 2;
                }
                NavigationManager.backToPage(this.props.navigation, step);
                if (this.mode.includes('shipping')) {
                    this.onSaveShippingAddress(this.addressData);
                } else {
                    this.onSaveBillingAddress(this.addressData);
                }
            }
        } else {
            this.props.storeData('showLoading', { type: 'dialog' });
            if (this.mode == address_detail_mode.normal.edit) {
                Connection.restData();
                Connection.setBodyData(this.addressData);
                Connection.connect(addresses, this, 'PUT');
            } else if (this.mode == address_detail_mode.normal.add_new) {
                Connection.restData();
                Connection.setBodyData(this.addressData);
                Connection.connect(addresses, this, 'POST');
            }
        }
    }

    setData(data) {
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } }, 
            { type: 'address_book_data', data: undefined }
        ]);
        if (this.mode == address_detail_mode.checkout.exist_customer.add_new) {
            NavigationManager.backToPreviousPage(this.props.navigation);

            NavigationManager.openPage(this.props.navigation, 'Checkout', {
                mode: checkout_mode.exist_customer,
                shippingAddressParams: { entity_id: data.Address.entity_id },
                billingAddressParams: { entity_id: data.Address.entity_id }
            });
        } else {
            // if (Device.isTablet()) {
            //     if (this.props.parent !== undefined) {
            //         this.props.parent.showAddressList();
            //     }
            // } else {

                NavigationManager.backToPreviousPage(this.props.navigation);
            // }
        }
    }

    createRef(id) {
        switch (id) {
            case 'default_address_form':
                return ref => (this.form = ref);
            default:
                return undefined;
        }
    }

    addMorePropsToComponent(element) {
        return {
            onRef: this.createRef(element.id)
        };
    }

    renderPhoneLayout() {
        return (
            <Container style={{backgroundColor: variable.appBackground}}>
                <Content>
                    <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 80 }}>
                        {this.renderLayoutFromConfig('address_layout', 'content')}
                    </View>
                </Content>
                {this.renderLayoutFromConfig('address_layout', 'container')}
            </Container>
        );
    }
}

//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(null, mapDispatchToProps)(AddressDetailPage);