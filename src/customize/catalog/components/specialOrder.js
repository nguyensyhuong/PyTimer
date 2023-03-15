import React from 'react'
import { Text } from 'native-base'
import { StyleSheet } from 'react-native'
import Identify from "@helper/Identify";
import Events from '@helper/config/events';
import md5 from 'md5';

const styles = StyleSheet.create({
    specialOrder: {
        position: 'absolute',
        bottom: 0,
        color: 'white',
        padding: 5,
        fontWeight: "bold"
    }
})

const SpecialOrderLabel = (props) => {
    return <Text style={[styles.specialOrder, Identify.isRtl() ? { left: 0 } : { right: 0 }, props.fontSize ? {fontSize: props.fontSize} : {}, {backgroundColor: Identify.theme.button_background}]}>{Identify.__('Special Order')}</Text>
}

export default SpecialOrderLabel;