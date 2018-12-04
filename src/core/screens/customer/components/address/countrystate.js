import React from 'react';
import { View } from 'react-native';
import Identify from '@helper/Identify';
import PickerInput from '@base/components/form/PickerInput';
import FloatingInput from '@base/components/form/FloatingInput';

export default class CountryStateFields extends React.Component {

    constructor(props) {
        super(props);
        this.selectedCountry = {};
        this.selectedState = {};
        this.address = this.props.address;
        let json = Identify.getMerchantConfig();
        this.allowedCountries = json.storeview.allowed_countries;
        this.allowedStates = [];
        this.initCountryState();
    }

    initCountryState() {
        if (this.address.country_id === undefined) {
            let defaultCountry = this.allowedCountries[0];
            this.setSelectedCountry(defaultCountry.country_code, defaultCountry.country_name);
            if (defaultCountry.states.length > 0) {
                let defaultState = defaultCountry.states[0];
                this.setSelectedState(defaultState.state_id, defaultState.state_name, defaultState.state_code);
            }
        } else {
            this.setSelectedCountry(this.address.country_id, this.address.country_name);
            this.setSelectedState(this.address.region_id, this.address.region, this.address.region_code);
        }
        this.getListState(this.selectedCountry.country_id);
    }

    getListState(countryId) {
        for (let index in this.allowedCountries) {
            let country = this.allowedCountries[index];
            if (country.country_code === countryId) {
                if (country.states.length > 0) {
                    this.allowedStates = country.states;
                } else {
                    this.allowedStates = [];
                }
                break;
            }
        }
    }

    updateCountry(countryId) {
        this.allowedCountries.forEach(country => {
            if (countryId === country.country_code) {
                this.setSelectedCountry(country.country_code, country.country_name);
                this.allowedStates = country.states;
                if (this.allowedStates.length > 0) {
                    let defaultState = this.allowedStates[0];
                    this.setSelectedState(defaultState.state_id, defaultState.state_name, defaultState.state_code);
                } else {
                    this.allowedStates = [];
                    this.setSelectedState('', '', '');
                }
            }
        });
    }

    updateFormData(key, value, validated) {
        if (key === 'country_id') {
            this.updateCountry(value);
            this.setState({});
        } else if(key === 'region') {
            this.setSelectedState('', value, '');
        } else {
            this.setSelectedState('', '', '');
            this.allowedStates.forEach(state => {
                if (value === state.state_id) {
                    this.setSelectedState(state.state_id, state.state_name, state.state_code);
                }
            });
        }
        this.props.parent.updateFormData('country_state', {
            ...this.selectedCountry,
            ...this.selectedState
        }, true);
    }

    setSelectedCountry(countryId, countryName) {
        this.selectedCountry['country_id'] = countryId;
        this.selectedCountry['country_name'] = countryName;
    }

    setSelectedState(regionId, region, regionCode) {
        this.selectedState['region_id'] = regionId;
        this.selectedState['region'] = region;
        this.selectedState['region_code'] = regionCode;
    }

    createStateInput() {
        if (this.allowedStates.length > 0) {
            return (<PickerInput
                key={'region_id'}
                inputKey={'region_id'}
                inputValue={this.selectedState.region_id}
                inputTitle={Identify.__('State')}
                required={true}
                parent={this}
                keyForDisplay={'state_name'}
                keyForSave={'state_id'}
                dataSource={this.allowedStates}
                enableEdit={this.allowedStates.length == 0 ? true : false}
            />);
        } else {
            return (<FloatingInput
                key={'region'}
                inputType={'text'}
                inputKey={'region'}
                inputValue={this.selectedState.region}
                inputTitle={Identify.__('State')}
                required={true}
                parent={this} />);
        }
    }

    componentDidMount() {
        this.props.parent.updateFormData('country_state', {
            ...this.selectedCountry,
            ...this.selectedState
        }, true);
    }

    render() {
        return (
            <View>
                <PickerInput
                    key={'country_id'}
                    inputKey={'country_id'}
                    inputValue={this.selectedCountry.country_id}
                    inputTitle={Identify.__('Country')}
                    required={true}
                    parent={this}
                    keyForDisplay={'country_name'}
                    keyForSave={'country_code'}
                    dataSource={this.allowedCountries}
                />
                {this.createStateInput()}
            </View>
        );
    }
}