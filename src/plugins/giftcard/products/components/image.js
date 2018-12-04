import React from 'react';
import {Image, TouchableOpacity} from 'react-native'
import Identify from "../../../../core/helper/Identify";

export default class ImageTemplate extends React.Component{
    constructor(props){
        super(props);
        this.parent = this.props.parent;
    }
    render(){
        let item = this.props.item;
        return (
            <TouchableOpacity
                style={{height: 80, marginEnd: 7, borderWidth: this.props.selected ? 2 : 0, borderColor: Identify.theme.key_color}}
                onPress={() => {
                    this.parent.parent.handleChangeImg(item.url, item.image, 0);
                }}>
                <Image resizeMode='center' source={{uri: item.url}} style={{width: 100, flex: 1}} />
            </TouchableOpacity>
        )
    }
}