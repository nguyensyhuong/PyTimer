import React from 'react';
import SimiComponent from "../../core/base/components/SimiComponent";
import {Text, View, Card, CardItem} from 'native-base';
import {Image} from 'react-native'

class RewardLabel extends SimiComponent{
    constructor(props){
        super(props);
        this.parent = this.props.parent;
    }

    getData(data){
        for(key in data){
            obj = data[key];
        }
        return obj;
    }

    renderContent(dataReward){
       let img = <View><Image style={{width: 15, height: 15, marginTop: 4, marginRight: 10}} source={{uri: dataReward.loyalty_image}}/></View>;
       let label = <View style={{flexDirection:'row',flexWrap: 'wrap'}}><Text style={{}}>{dataReward.loyalty_label}</Text></View>;
        if(this.props.isProduct){
            return(
                <Card style={{
                    flex: 1,
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 10}}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            }}>
                        {img}
                        {label}
                    </View>
                </Card>
            )
        }
        return(
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: 20,
                    marginRight: 20,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomWidth: 0.3,
                    borderColor: '#c9c9c9'}}>
                {img}
                {label}
            </View>
        )
    }

    renderPhoneLayout(){
        let data = this.parent.props.data;
        if(this.props.isProduct){
            if(this.parent.state.reRender){
                if(this.getData(data).hasOwnProperty('loyalty_image') || this.getData(data).hasOwnProperty('loyalty_label')){
                    return this.renderContent(this.getData(data))
                }
            }
            return null;
        }else {
            if (data.hasOwnProperty('loyalty')) {
                return this.renderContent(data.loyalty)
            }
            return null
        }

    }
}
export default RewardLabel;