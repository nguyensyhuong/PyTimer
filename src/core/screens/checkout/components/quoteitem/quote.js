import React from 'react';
import {connect} from 'react-redux';
import { View, Text} from 'native-base';
import Identify from '../../../../helper/Identify';
import {StyleSheet} from 'react-native';
import material from '../../../../../../native-base-theme/variables/material';

class Quote extends React.Component {
    constructor(props) {
        super(props);
        this.merchant_configs = Identify.isEmpty(this.props.data.merchant_configs) ? null : this.props.data.merchant_configs;
        this.quoteItem = this.props.item ? this.props.item : 0;
        this.style = this.props.style ?  this.props.style : {};
        this.tax_cart_display_price = this.merchant_configs.storeview.tax.tax_cart_display_price;
    }

    renderQuote(quoteItem){
        let price = <Text style={styles.itemStyle}>{Identify.__('Price') + ': '}<Text>{Identify.formatPrice(quoteItem.row_total)}</Text></Text>;
        if (this.tax_cart_display_price == 3) {
            price = (<View>
                <Text style={styles.itemStyle}>{Identify.__('Incl. Tax') + ': '}<Text style={styles.itemStyle}>{Identify.formatPrice(quoteItem.row_total_incl_tax)}</Text></Text>
                <Text style={styles.itemStyle}>{Identify.__('Excl. Tax') + ': '}<Text style={styles.itemStyle}>{Identify.formatPrice(quoteItem.row_total)}</Text></Text>
            </View>);
        } else if (this.tax_cart_display_price == 2) {
            price = <Text style={styles.itemStyle}>{Identify.__('Price') + ': '}<Text>{Identify.formatPrice(quoteItem.row_total_incl_tax)}</Text></Text>;
        } else {
            price = <Text style={styles.itemStyle}>{Identify.__('Price') + ': '}<Text>{Identify.formatPrice(quoteItem.row_total)}</Text></Text>;
        }
        let optionText = [];
        if (this.quoteItem.option) {
            let options = quoteItem.option;
            for (let i in options) {
                let option = options[i];
                optionText.push(<Text style={styles.itemStyle}
                                      key={Identify.makeid()}>{option.option_title + ': ' + option.option_value}</Text>);
            }
        }
        return (
            <View>
                {price}
                {optionText}
            </View>
        );
    }

    render(){
        if(this.quoteItem != 0){
            return this.renderQuote(this.quoteItem)
        }else {
            return (
                <Text style={this.style}>0</Text>
            );
        }
    }
}

const styles = StyleSheet.create({
    itemStyle:{
        fontSize: material.textSizeSmall,
        textAlign: 'left'
    }
});
const mapStateToProps = (state) => {
    return {data: state.redux_data};
}
export default connect(mapStateToProps)(Quote);
