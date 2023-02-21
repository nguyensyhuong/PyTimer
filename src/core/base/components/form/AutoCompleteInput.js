import React from 'react';
import BaseInput from './BaseInput';
import { Item, Input, Label, Icon, View, Text } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class AutoCompleteInput extends BaseInput {

    constructor(props) {
        super(props);
        this.state = {
              text: this.props.inputValue
        }
        this.count = 1;
    }

    componentWillMount() {
        if(this.props.inputValue && this.props.inputValue != ''){
            if(this.state.text == ''){
                this.state.text = this.props.inputValue;
            }         
            this.props.parent.updateFormData(this.inputKey, this.props.inputValue, true);    
        }
    }

    createInputLayout() {
        this.count = this.count + 1;
        return (
            <View style={{ flexDirection: 'column', marginBottom: 10 }}>
                <Text style={{ alignSelf: 'flex-start' }}>{this.inputTitle}</Text>
                <GooglePlacesAutocomplete
                        placeholder='Enter your street'
                        onPress={(data, details = null) => {
                            let addressComponents = details.address_components
                            let postCode, city, state, streetNumber, route;
                            if(addressComponents.length > 0) {
                                for(let i in addressComponents) {
                                    const addressComponent = addressComponents[i]
                                    if(addressComponent.types && addressComponent.types.length) {
                                        if(!city && (addressComponent.types.includes('neighborhood') || addressComponent.types.includes('locality'))) {
                                            city = addressComponent.long_name
                                        }

                                        if(!streetNumber && addressComponent.types.includes('street_number')) {
                                            streetNumber = addressComponent.long_name
                                        }

                                        if(!route && addressComponent.types.includes('route')) {
                                            route = addressComponent.short_name
                                        }
                
                                        if(!postCode && addressComponent.types.includes('postal_code')) {
                                            postCode = addressComponent.long_name
                                        }
                
                                        if(!state && addressComponent.types.includes('administrative_area_level_1')) {
                                            state = addressComponent.short_name
                                        }
                                    }
                                }
                            }

                            let street = ''
                            if(streetNumber) street += streetNumber + ', '
                            if(route) street += route
                            this.setState({text: street});
                            this.props.addData({postCode, city, state}, street);
                        }}
                        styles={{
                              textInput: {
                                backgroundColor: '#FFFFFF',
                                height: 36,
                                borderRadius: 5,
                                paddingVertical: 0,
                                paddingHorizontal: 0,
                                borderBottomWidth: 1,
                                borderBottomColor: '#ddd',
                                fontSize: 15,
                                flex: 1,
                              },
                              listView: {
                                    borderWidth: 1,
                                    borderColor: '#ddd'
                              }
                        }}
                        textInputProps={{
                              ref: (input) => {
                                    this.props.parent.listRefs[this.inputKey] = input 
                              },
                              onSubmitEditing: () => { this.submitEditing() },
                              returnKeyType: "done",
                              value: this.state.text,
                              onChangeText: (text) => {
                                    if(this.props.inputValue && this.props.inputValue == '') {
                                        this.setState({text: text});
                                        this.parent.updateFormData(this.inputKey, this.state.text, true);
                                    } else {
                                        let validateResult;
                                        if(text == '' && this.count < 3){
                                            this.setState({text: this.props.inputValue}, ()=> {
                                                validateResult = this.validateInputValue(this.state.text);
                                                this.parent.updateFormData(this.inputKey, this.state.text, validateResult);
                                            })
                                        } else {
                                            this.setState({text: text}, ()=> {
                                                validateResult = this.validateInputValue(this.state.text);
                                                this.parent.updateFormData(this.inputKey, this.state.text, validateResult);
                                            });
                                        }
                                    }
                              }
                        }}
                        fetchDetails={true}
                        query={{
                            key: Identify.getMerchantConfig().storeview.address_autocomplete.api_key,
                            language: 'en',
                        }}
                    />
            </View>
        );
    }

}