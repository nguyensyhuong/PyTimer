import React from 'react';
import { Icon, View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native';
import NavigationManager from '../../../../helper/NavigationManager';
import Identify from '../../../../helper/Identify';
import styles from './styles';
import { products_mode } from '../../../../helper/constants';

class Search extends React.Component {

    openSearchPage() {
        if (this.props.navigation.getParam("query")) {
            NavigationManager.backToPreviousPage(this.props.navigation);
        } else {
            let mode = this.props.navigation.getParam("mode");
            if (mode && mode === products_mode.spot) {
                routeName = 'SearchProducts';
                params = {
                    spotId: this.props.navigation.getParam("spotId"),
                    mode: mode,
                };
            } else {
                routeName = 'SearchProducts';
                params = {
                    categoryId: this.props.navigation.getParam("categoryId"),
                    categoryName: this.props.navigation.getParam("categoryName"),
                };
            }
            if(this.props.isHome) {
                NavigationManager.openRootPage(this.props.navigation, routeName, params);
            } else {
                NavigationManager.openPage(this.props.navigation, routeName, params);
            }
        }
    }

    render() {
        let text = this.props.navigation.getParam("query") ? this.props.navigation.getParam("query") : Identify.__('Search');
        return (
            <TouchableOpacity style={styles.container} onPress={() => {
                this.openSearchPage();
            }}>
                <View style={styles.search}>
                    <View style={styles.center}>
                        <Icon style={styles.icon} name='search' />
                        <Text style={styles.text}>{text}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
export default Search;
