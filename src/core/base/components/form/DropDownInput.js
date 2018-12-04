import React from 'react';
import BaseInput from './BaseInput';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker, Icon, Label, Item } from 'native-base';
import Identify from '@helper/Identify';
import material from '../../../../../native-base-theme/variables/material';

export default class DropDownInput extends BaseInput {

    constructor(props) {
        super(props);
    }

    initData() {
        super.initData();
        this.dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        this.keyForSave = this.props.keyForSave;
        this.keyForDisplay = this.props.keyForDisplay;

        if(Platform.OS === 'android') {
            this.dataSource.unshift({
                value: undefined,
                label: '-- Please Select --'
            });
        }

    }

    onValueChange(value: string) {
        this.setState({ value: value });
        let validated = false;
        if (this.props.required && value || !this.props.required) {
            validated = true;
        }
        this.parent.updateFormData(this.inputKey, value, validated);
    }

    renderItems() {
        let items = [];

        let dataSource = this.dataSource;
        for (let index in dataSource) {
            let item = dataSource[index];
            items.push(
                <Picker.Item key={Identify.makeid()} value={item[this.keyForSave]}
                    label={item[this.keyForDisplay]} />
            );
        }

        return items;
    }

    createInputLayout() {
        return (
            <View>
                <Item error={this.state.error} success={this.state.success} picker style={styles.item} inlineLabel>
                    <Label>{this.inputTitle}</Label>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        selectedValue={this.state.value}
                        onValueChange={this.onValueChange.bind(this)}>
                        {this.renderItems()}
                    </Picker>
                </Item>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    item: {
        marginLeft: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        flex: 1,
        height: 40,
        marginTop: 30
    },
    placeholder: {
        fontSize: material.textSizeBigger,
        color: '#808080'
    },
    value: {
        fontSize: material.textSizeBigger,
        color: 'black'
    }
});