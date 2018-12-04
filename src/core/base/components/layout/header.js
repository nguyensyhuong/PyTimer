import React from 'react';
import { View } from 'react-native';
import { Header } from 'native-base';
import { connect } from 'react-redux';
import Layout from '@helper/config/layout';
import md5 from 'md5';
import variable from "@theme/variables/material";

class HeaderApp extends React.Component {
    goBack() {
        this.props.navigation.goBack(null)
    }
    render() {
        let contents = Layout.layout.header_layout['content'];
        let components = [];
        for (let i = 0; i < contents.length; i++) {
            let element = contents[i];
            if (element.active == true) {
                let key = md5("content_header" + i);
                let Content = element.content;
                components.push(<Content
                    parent={this}
                    navigation={this.props.navigation}
                    key={key}
                />);
            }
        }
        return (
            <Header style={{ backgroundColor: variable.toolbarDefaultBg }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    {components}
                </View>
            </Header>
        );
    }
}


const mapStateToProps = (state) => {
    return { data: state.redux_data.quoteitems, customer_data: state.redux_data.customer_data };
}
// export default HeaderApp;
export default connect(mapStateToProps)(HeaderApp);
