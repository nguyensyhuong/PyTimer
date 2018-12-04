import React from 'react';
import SimiComponent from "../../../../core/base/components/SimiComponent";
import {Text, View, ListItem, Picker, Icon, Button} from 'native-base';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import Identify from "../../../../core/helper/Identify";
import ImagePicker from 'react-native-image-picker';
import ImageTemplate from './image';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
class Template extends SimiComponent{
    constructor(props){
        super(props)
        this.state = {
            id : 0, // template_id,
            avatarSource: null,
            avatarName: null
        };
        this.parent = this.props.parent;
    }

    renderSelectTemplate = ()=>{
        let data = this.props.data;
        if(data.length === 1){
            return(
                <View></View>
            )
        }
        let template = data.map((item,id) => {
            return(
                <Picker.Item key={Identify.makeid()} value={id} label={item.template_name}/>
            )
        });
        return(
            <View style={{marginBottom:10}}>
                <Text>{Identify.__('Select a template')}</Text>
                <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                    selectedValue={this.parent.state.id}
                    onValueChange={this.parent.handleChangeTemplate.bind(this)}>
                    {template}
                </Picker>
            </View>
        )
    };
    generatePropsToFlatlist(){
        return {
            style : {height: 80, marginBottom: 15},
            data : this.props.data[this.parent.state.id].images,
            horizontal: true,
            showsHorizontalScrollIndicator: false
        }
    }
    renderImageItem(item){
        return <ImageTemplate selected={this.parent.state.url_image === item.url} item={item} parent={this}/>
    }
    renderListImages = ()=>{
        let data = this.props.data[this.parent.state.id];
        this.parent.giftcard_template_id = data.giftcard_template_id;
        return(
            <FlatList
                {...this.generatePropsToFlatlist()}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item}) =>
                    this.renderImageItem(item)
                } />
        )
    };

    showUpLoad(){
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = response.uri;
                const name = response.fileName;
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                    avatarName : name
                });
            }
        });
    }

    renderUpLoadFile(){
        let img = this.state.avatarSource === null ? null :
            <TouchableOpacity
                style={{
                    flex: 1,
                    padding: 5,
                    width: '40%',
                    marginTop: 15,
                    borderWidth: this.parent.state.url_image === this.state.avatarSource ? 2 : 0,
                    borderColor: Identify.theme.key_color}}
                onPress={() => this.parent.handleChangeImg(this.state.avatarSource,this.state.avatarName,1)}>
                <Image style={{flex: 1, aspectRatio: 2}} source={{uri : this.state.avatarSource}}/>
            </TouchableOpacity>
        if(this.parent.state.data.simigiftcard.simigiftcard_settings.simigift_template_upload != '0'){
            return(
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Button
                        title={Identify.__('UPLOAD IMAGE')}
                        onPress={() => this.showUpLoad()}
                    >
                        <Text>{Identify.__('UPLOAD IMAGE')}</Text>
                    </Button>
                    {img}
                </View>
            )
        }
        return null;
    }

    renderPhoneLayout(){
        return(
            <View>
                {this.renderSelectTemplate()}
                {this.renderListImages()}
                {this.renderUpLoadFile()}
            </View>
        )
    }
}
export default Template