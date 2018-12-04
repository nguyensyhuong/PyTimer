import React from 'react';
import NavigationManager from '@helper/NavigationManager';

export default class Redirect extends React.Component {
    componentWillMount() {
        NavigationManager.openRootPage(this.props.navigation, this.props.routeName, this.props.params);
    }
    render(){
        return null;
    }
}
