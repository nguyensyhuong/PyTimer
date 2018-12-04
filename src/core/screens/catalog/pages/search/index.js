import React from 'react';
import { Container, View, Icon, Input } from 'native-base';
import Identify from '@helper/Identify';
import styles from './styles';
import variable from '../../../../../../native-base-theme/variables/material';
import md5 from 'md5';
import SimiPageComponent from "@base/components/SimiPageComponent";
import Events from '@helper/config/events';
import NavigationManager from "../../../../helper/NavigationManager";

class SearchProducts extends SimiPageComponent {

    constructor(props) {
        super(props);
        this.isBack = true;
        this.showSearch = false;
        this.state = {
            ...this.state,
            text: '',
            showClear: false
        }
    }

    onChangeText(txt) {
        this.state.text = txt;
        if (this.state.showClear && this.state.text.length == 0) {
            this.setState({ showClear: false });
        } else if (!this.state.showClear && this.state.text.length > 0) {
            this.setState({ showClear: true });
        }
    }

    onEndEditing() {
        if (this.state.text.length > 0) {
            routeName = 'Products';
            params = {
                categoryId: this.props.navigation.getParam("categoryId"),
                categoryName: this.props.navigation.getParam("categoryName"),
                query: this.state.text
            };
            NavigationManager.openPage(this.props.navigation, routeName, params)
        }
    }

    renderPhoneLayout() {
        let voiceSearch = this.dispatchAddItem();
        return (
            <Container>
                <View style={[styles.container, { backgroundColor: variable.toolbarDefaultBg == '#ffffff' ? variable.toolbarBtnColor : variable.toolbarDefaultBg }]}>
                    <View regular style={styles.search}>
                        <Icon name='search' style={[styles.icon, { color: variable.toolbarDefaultBg == '#ffffff' ? variable.toolbarBtnColor : variable.toolbarDefaultBg }]} />
                        <View style={styles.inputContainer}>
                            <Input style={{ flex: 1 }}
                                placeholder={Identify.__('What are you looking for?')}
                                autoFocus={true}
                                ref={input => { this.textInput = input }}
                                onChangeText={(txt) => { this.onChangeText(txt) }}
                                onEndEditing={() => { this.onEndEditing() }} />
                            {this.state.showClear && <Icon style={styles.clearIcon} name='md-close' onPress={() => {
                                this.setState({ text: '', showClear: false });
                            }} />}
                            {voiceSearch}

                        </View>
                    </View>
                </View>
            </Container>
        );
    }

    dispatchAddItem() {
        let plugins = [];
        for (let i = 0; i < Events.events.search_page.length; i++) {
            let node = Events.events.search_page[i];
            if (node.active === true) {
                let key = md5("pages_search_items" + i);
                let Content = node.content;
                plugins.push(<View style={{ marginBottom: 10, marginTop: 10, alignItems: 'baseline' }} key={key}>
                    <Content obj={this} />
                </View>);
            }
        }
        return plugins;
    }

}

export default SearchProducts;
