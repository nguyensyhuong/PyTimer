import React, {
    PixelRatio,
    Platform,
    Dimensions
} from 'react-native';

const windowSize = Dimensions.get('window');

export default class Device {

    static isTablet() {
        let pixelDensity = PixelRatio.get();
        let width = windowSize.width;
        let height = windowSize.height;
        let adjustedWidth = width * pixelDensity;
        let adjustedHeight = height * pixelDensity;

        if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
            return true;
        } else if (pixelDensity === 1 && (adjustedWidth == 600 || adjustedHeight == 960)) {
            return true;
        } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
            return true;
        } else {
            return false;
        }
    }

}
