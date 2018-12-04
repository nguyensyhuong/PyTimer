import React from 'react';
import Identify from "../../../../../../helper/Identify";
import Abstract from './Abstract';
import { Input, Item, Textarea } from 'native-base';

class Text extends Abstract {

    constructor(props) {
        super(props);
        this.text = '';
    }

    getValues() {
        return this.text;
    }

    renderTextField = () => {
        return (
            <Item regular style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                <Input placeholder="Enter text in here" onChangeText={(txt) => {
                    this.text = txt;
                    this.parent.updatePrices();
                }} />
            </Item>
        )
    };

    renderTextArea = () => {
        return (
            <Textarea rowSpan={5} bordered placeholder="Enter text in here" style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }} onChangeText={(txt) => this.text = txt} />
        )
    }

    render() {
        if (this.props.type === 'area') {
            return this.renderTextArea();
        }
        return this.renderTextField();
    }
}
export default Text;
