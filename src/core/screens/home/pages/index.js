import React from 'react';
import { Container } from "native-base";
import { BackHandler, Platform , Alert} from 'react-native'
import SimiPageComponent from "@base/components/SimiPageComponent";
import Connection from '@base/network/Connection';
import { homes_lite } from '@helper/constants';
import Identify from '@helper/Identify';
import { connect } from 'react-redux';

let HomeContent = null;
class Home extends SimiPageComponent {
    constructor(props) {
        super(props);
        let appConfig = this.props.dashboard['app-configs'][0];
        this.layout = appConfig.home;
        this.isBack = false;
    }

    componentWillMount() {
        if (this.props.loading.type === 'none' && Identify.isEmpty(this.props.data)) {
            this.showLoading('full');
        }
    }
    componentDidMount() {
        if (Identify.isEmpty(this.props.data)) {
            Connection.restData();
            let appConfig = this.props.dashboard['app-configs'][0];
            if (this.layout == 'zara') {
                let data = [];
                data['get_child_cat'] = 1;
                Connection.setGetData(data);
            }
            Connection.connect(homes_lite, this, 'GET');
        }
        if(this.props.navigation.state.routeName === 'Home'){
            BackHandler.addEventListener('hardwareBackPress', this.handleBackAndroid);
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackAndroid)
    }
    handleBackAndroid = () =>{
        Alert.alert(
            'Warning',
            'Are you sure you want to exit app?',
            [
                { text: 'Cancel', onPress: () => { style: 'cancel' } },
                {
                    text: 'OK', onPress: () => {
                        BackHandler.exitApp()
                    }
                },
            ],
            { cancelable: true }
        )
    }
    setData(data) {
        //store data and disable loading.
        this.showLoading('none', false);
        this.props.storeData('home_data', data);
    }

    renderLayout() {
        if (this.layout == 'default') {
            HomeContent = require('./default').default;
            return <HomeContent navigation={this.props.navigation} />
        } else if (this.layout == 'matrix') {
            HomeContent = require('./matrix').default;
            return <HomeContent navigation={this.props.navigation} />
        } else if (this.layout == 'zara') {
            HomeContent = require('./zara').default;
            return <HomeContent navigation={this.props.navigation} />
        } else {
            return null;
        }
    }
    renderPhoneLayout() {
        return (
            <Container>
                {this.renderLayout()}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.redux_data.showLoading,
        dashboard: state.redux_data.dashboard_configs,
        data: state.redux_data.home_data
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

//export default Home;
