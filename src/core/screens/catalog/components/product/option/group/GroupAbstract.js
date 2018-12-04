import React from 'react';
import OptionAbstract from '../OptionAbstract';
import Identify from '../../../../../../helper/Identify';
import Price from '../../price/index';
import { ListItem, Left, Right, Icon, Text } from "native-base";
import { View } from 'react-native';
import material from '../../../../../../../../native-base-theme/variables/material';

class GroupAbstract extends OptionAbstract {

    constructor(props) {
        super(props);
        this.state = {qty: {}};
    }

    componentDidMount() {
      super.componentDidMount();
        this.setState({qty: this.state.qty});
    }

    renderOptions =()=>{
        let attributes = this.data.grouped_options;
        let objOptions = [];
        let labelRequired = '';

        for (let i in attributes) {
            let attribute = attributes[i];
            let id = attribute.id;
            let itemQty = parseInt(attribute.qty);
            if(id in this.state.qty) {
                itemQty = this.state.qty[id];
            } else if(attribute.is_salable == '1') {
                this.state.qty[id] = itemQty;
            }
            let element =
                <View key={Identify.makeid()}>
                    <ListItem style={{borderBottomWidth: 0}}>
                        <Left>
                            <Text style={{fontFamily: material.fontBold}}>{attribute.name}</Text>
                        </Left>
                        <Right>
                            {(itemQty > 0 && attribute.is_salable == '1') && <Text style={{color: 'red'}}>x{itemQty}</Text>}
                        </Right>
                    </ListItem>
                    {this.renderContentAttribute(attribute, id)}
                </View>;
            objOptions.push(element);
        }

        return (
            <View>
                {objOptions}
            </View>
        );
    }

    updateOptions =(key,val)=>{
        this.selected[key] = val;
    };

    renderContentAttribute =(attribute, id) => {
        let key = attribute.id;
        this.updateOptions(key,key);
        let qty = attribute.qty;
        let outStock = attribute.is_salable === "0";

        return(
            <ListItem style={{borderBottomWidth: 0}}>
              <Left>
                <Price config={1} type={'simple'} prices={attribute}/>
              </Left>
              <Right>
                {(attribute.is_salable == '1') && <View style={{flexDirection: 'row'}}>
                    <Icon name='ios-remove-circle-outline' style={{color: '#000000'}} onPress={() => {
                        let id = attribute.id;
                        if(id in this.state.qty && this.state.qty[id] > 0) {
                            this.state.qty[id]--;
                            this.setState({qty: this.state.qty});
                            // console.log(this.state.qty);
                        }
                    }}/>
                    <Icon name='ios-add-circle-outline' style={{color: '#000000', marginLeft: 15}} onPress={() => {
                        let id = attribute.id;
                        if(id in this.state.qty) {
                            this.state.qty[id]++;
                            this.setState({qty: this.state.qty});
                            // console.log(this.state.qty);
                        }
                    }}/>
                </View>}
                {(attribute.is_salable == '0') && <Text style={{fontSize: material.textSizeTiny}}>Out of stock</Text>}
              </Right>
            </ListItem>
        );
    }

    getParams = () => {
      let params = {};
        for(let key in this.state.qty) {
          let itemQty = this.state.qty[key];
          if(itemQty > 0) {
            params[key] = itemQty;
          }
        }

        return {
          super_group: params
        };
    }
}
export default GroupAbstract;
