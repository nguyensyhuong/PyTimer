import React from 'react';
import { View, Image, Platform, Dimensions } from 'react-native';
import { Text } from 'native-base';
import AppSettings from '../components/merchant';
import DashboardSettings from '../components/dashboard';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';
import Redirect from './redirect';
import md5 from 'md5';
import { NetworkApp } from "@base/components/layout/config";
import NavigationManager from '@helper/NavigationManager';
import SimiPageComponent from "@base/components/SimiPageComponent";
import Events from '@helper/config/events';
import ImageSplash from '../components/image';

class Splash extends SimiPageComponent {
    constructor(props, context) {
        super(props);
        this.key_1 = md5("splash_key_1");
        this.key_2 = md5("splash_key_2");
    }

    dispatchSplashCompleted() {
        for (let i = 0; i < Events.events.splash_completed.length; i++) {
            let node = Events.events.splash_completed[i];
            if (node.active === true) {
                let action = node.action;
                action.onSplashCompleted();
            }
        }
    }

    render() {
        NavigationManager.saveNavigation(this.props.navigation);
        if (Identify.isEmpty(this.props.data.merchant_configs)
            || Identify.isEmpty(this.props.data.dashboard_configs)) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <ImageSplash />
                    <AppSettings isLoading={false} key={this.key_1} />
                    <DashboardSettings isLoading={false} key={this.key_2} />
                    <NetworkApp />
                </View>
            );
        }
        this.dispatchSplashCompleted();
        return (
            <Redirect navigation={this.props.navigation} />
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
// export default Splash;
export default connect(mapStateToProps)(Splash);
