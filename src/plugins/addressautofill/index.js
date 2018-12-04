import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Fab, Icon } from 'native-base';
import { View } from 'react-native';
import Connection from '@base/network/Connection';
import {addressautofill} from '../constants'
export default class AddressAutoFill extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            position: undefined,
            region: undefined
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    requestGetAddressInfo(latitude, longitude) {
        Connection.restData();
        Connection.setGetData({
            longitude: longitude,
            latitude: latitude
        });
        Connection.connect(addressautofill, this, 'GET');
    }

    setData(data) {
        console.log(data);
    }

    markCurrentLocation() {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude, longitude } = coords;
                this.requestGetAddressInfo(latitude, longitude);
                this.setState({
                    position: {
                        latitude,
                        longitude,
                    },
                    region: {
                        latitude,
                        longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.001,
                    }
                })
            },
            (error) => alert(JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }

    render() {
        return (
            <View style={{ flex: 1, height: 250, marginTop: 30 }}>
                <MapView style={{ flex: 1 }}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    followUserLocation={true}
                    showsMyLocationButton={true}
                    region={this.state.region}>

                </MapView>
                <Fab
                    active='true'
                    style={{ backgroundColor: 'white' }}
                    position="bottomRight"
                    onPress={() => { this.markCurrentLocation() }}>
                    <Icon name="md-locate" style={{ color: 'blue' }} />
                </Fab>
            </View>
        );
    }
}