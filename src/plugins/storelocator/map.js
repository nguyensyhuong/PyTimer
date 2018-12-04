import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import MapView, { Marker } from 'react-native-maps';
import styles from "./styles";
import { View, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class StoreMap extends SimiComponent {

    constructor(props) {
        super(props);
        this.markers = [];
    }

    _mapReady() {
        this.map.fitToCoordinates(this.markers, {
            edgePadding: DEFAULT_PADDING,
            animated: true,
        });
    }

    renderMarker(data) {
        try {
            let list = [];
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let marker = {
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longtitude)
                }
                this.markers.push(marker);
                list.push(
                    <Marker
                        key={i}
                        title={item.name}
                        description={item.description}
                        coordinate={marker}
                    />
                );
            }
            this.markers.push({
                latitude: this.props.parent.latitude,
                longitude: this.props.parent.longitude
            });
            return list.length > 0 ? list : null;
        } catch (e) {
            console.log(e);
            return null;
        }

    }

    renderPhoneLayout() {
        return (
            <View style={styles.containerlist}>
                <MapView
                    onLayout={(event) => { this._mapReady() }}
                    ref={ref => { this.map = ref; }}
                    style={styles.maplist}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    followUserLocation={true}
                    showsMyLocationButton={true}
                    initialRegion={{
                        latitude: this.props.parent.latitude,
                        longitude: this.props.parent.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    {this.renderMarker(this.props.data.storelocations)}
                </MapView>
            </View>
        );
    }
}