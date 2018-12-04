import React from 'react';
import { Linking, ListView, TouchableOpacity } from 'react-native';
import { Container, Text, View, Icon } from "native-base";
import Identify from '@helper/Identify';
import styles from './Styles';
import SimiPageComponent from "@base/components/SimiPageComponent";

class ContactUs extends SimiPageComponent {
    constructor(props) {
        super(props)

        const merchantConfig = Identify.getMerchantConfig()
        if (!merchantConfig || !merchantConfig.storeview.instant_contact)
            return
            
        const instantConfig = merchantConfig.storeview.instant_contact
        this.isGrid = parseInt(instantConfig.style, 10)
        this.activeColor = instantConfig.activecolor ? '#' + instantConfig.activecolor : '#FF9900'

        let contactItems = []
        if (instantConfig.email) {
            instantConfig.email.map(item => {
                contactItems.push({
                    link: 'mailto:' + item,
                    title: (instantConfig.email.length == 1) ? Identify.__('Email') : Identify.__('Email') + item,
                    icon: 'ios-mail'
                })
            })
        }

        if (instantConfig.phone) {
            instantConfig.phone.map(item => {
                contactItems.push({
                    link: 'tel::' + item,
                    title: (instantConfig.phone.length == 1) ? Identify.__('Call') : Identify.__('Call') + item,
                    icon: 'ios-call'
                })
                return null
            })
        }

        if (instantConfig.message) {
            instantConfig.message.map(item => {
                contactItems.push({
                    link: 'sms::' + item,
                    title: (instantConfig.message.length == 1) ? Identify.__('Message') : Identify.__('Message') + item,
                    icon: 'ios-chatboxes'
                })
                return null
            })
        }

        if (instantConfig.website)
            contactItems.push({
                link: instantConfig.website,
                title: Identify.__('Website'),
                icon: 'ios-globe'
            })

        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state.dataSource = ds.cloneWithRows(contactItems)
    }

    renderItem(item) {
        return (
            <View style={this.isGrid ? styles.gridItem : styles.listItem}>
                <TouchableOpacity onPress={() => Linking.openURL(item.link)}
                    style={this.isGrid ? styles.gridItemTouchable : styles.listItemTouchable}>
                    <Icon name={item.icon}
                        style={
                            [
                                this.isGrid ? styles.gridItemIcon : styles.listItemIcon,
                                {
                                    color: this.activeColor,
                                    borderColor: this.isGrid ? this.activeColor : 'transparent'
                                }
                            ]
                        } />
                    <Text style={this.isGrid ? styles.gridItemTitle : styles.listItemTitle}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderPhoneLayout() {
        if (!this.state.dataSource)
            return

        return (
            <Container>
                <ListView
                    contentContainerStyle={this.isGrid ? styles.grid : styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this.renderItem(rowData)}
                />
            </Container>
        )
    }
}
export default (ContactUs);
