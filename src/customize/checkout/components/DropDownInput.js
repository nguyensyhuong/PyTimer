import React from 'react';
import BaseInput from '@base/components/form/BaseInput';
import { View, StyleSheet, Platform, Picker } from 'react-native';
import { Icon, Item, Header, Title, Body, Left, Right, Button, Text, Row } from 'native-base';
import Identify from '@helper/Identify';
import material from '@theme/variables/material';
import ModalDropdown from 'react-native-modal-dropdown';

export default class DropDownInput extends BaseInput {

    constructor(props) {
        super(props);
        this.toolbarHeight = material.toolbarHeight;
        this.paddingTop = Platform.OS === 'ios' ? 18 : 0;
        this.initData();
    }

    initData() {
        super.initData();
        this.dataSource = JSON.parse(JSON.stringify(this.props.dataSource));
        this.keyForSave = this.props.keyForSave;
        this.keyForDisplay = this.props.keyForDisplay;

        // if (Platform.OS === 'android') {
        // this.dataSource.unshift({
        //     value: '00',
        //     label: '-- ' + Identify.__('Please Select') + ' --'
        // });
        // }

    }

    onValueChange(value) {
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
                <Picker.Item key={Identify.makeid()} value={item[this.keyForSave].toString()}
                    label={Identify.__(item[this.keyForDisplay])}
                    color={material.textColor} />
            );
        }

        return items;
    }

    createInputLayout() {
        let defaultItem = this.dataSource.find((item) => item.value == this.state.value);
        return (
            <View>
                {/* <Item error={this.state.error} success={this.state.success} picker style={styles.item} inlineLabel> */}
                <View style={styles.item}>
                    <Text style={{ marginRight: 10 }}>{this.inputTitle}</Text>
                    {/* <Picker
                        renderHeader={backAction =>
                            <Header style={{
                                backgroundColor: Identify.theme.app_background,
                                elevation: 0,
                                height: this.toolbarHeight,
                                paddingTop: this.paddingTop
                            }}>
                                <Left>
                                    <Button transparent onPress={backAction}>
                                        <Icon name={"md-close"} style={{ color: Identify.theme.button_background }} />
                                    </Button>
                                </Left>
                                <Body style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                                    <Title style={{ color: Identify.theme.content_color }}>{this.inputTitle}</Title>
                                </Body>
                                <Right />
                            </Header>}
                        mode="dropdown"
                        selectedValue={this.state.value}
                        onValueChange={(value) => { this.onValueChange(value) }}
                        itemTextStyle={{ color: material.textColor, fontFamily: material.fontFamily }}
                        textStyle={{ color: material.textColor, fontFamily: material.fontFamily }}
                        style={{width: '100%', direction: 'rtl'}}>
                        {this.renderItems()}
                    </Picker>
                    <Icon name="ios-arrow-down" style={{position: 'absolute', right: 0, fontSize: 16}} /> */}
                    <ModalDropdown
                        style={{ height: 40, width: '100%', justifyContent: 'flex-start' }}
                        textStyle={{ color: material.textColor, fontSize: 14, height: 40, width: '100%', paddingTop: 13 }}
                        options={this.dataSource}
                        defaultValue={defaultItem ? defaultItem.label : undefined}
                        renderRow={(rowData, rowID, highlighted) => {
                            return (
                                <Text style={{ padding: 10, width: 200 }}>{Identify.__(rowData[this.keyForDisplay])}</Text>
                            );
                        }}
                        renderButtonText={(rowData) => {
                            return rowData[this.keyForDisplay];
                        }}
                        onSelect={(idx, value) => this.onValueChange(value.value)}
                    />
                </View>
                {/* </Item> */}
            </View>
        );
    }

    render() {
        return (
            <View style={{
                ...(Platform.OS !== 'android' && {
                    zIndex: this.props.zIndex ?? 10
                })
            }}>
                {this.createInputLayout()}
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
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EDEDED'
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