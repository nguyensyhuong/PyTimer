import React from 'react';
import { View, Text } from 'native-base';
import Identify from '../../../../../helper/Identify';
import Format from './format';
import Language from '../../../../../base/components/language/index';
import material from '@theme/variables/material';

class Simple extends React.Component {
    constructor(props) {
        super(props);
    }

    renderView() {
        let price_label = null;
        let weee = null;
        let low_price_label = null;
        let low_price = null;
        let special_price_label = null;
        let price_excluding_tax = null;
        let price_including_tax = null;
        let from_to_tax_price = null;
        let price = null;

        if (this.prices.has_special_price !== null && this.prices.has_special_price === 1) {
            let sale_off = 0;
            if (this.prices.show_ex_in_price != null && this.prices.show_ex_in_price == 1) {
                special_price_label = (<Text>{this.prices.special_price_label}</Text>);
                price_excluding_tax = (
                    <View style={this.parent.style.styleOneRowPrice}>
                        <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_excluding_tax.label) + ': '}</Text>
                        <Format style={this.parent.style.styleSpecialPrice} price={this.prices.price_excluding_tax.price} />
                    </View>
                );
                if (this.prices.show_weee_price != null && this.prices.show_weee_price == 1) {
                    weee = <Language style={this.parent.style.styleLabel} text={this.prices.weee} />;
                }
                price_including_tax = (
                    <View style={this.parent.style.styleOneRowPrice}>
                        <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_including_tax.label) + ': '}</Text>
                        <Format style={this.parent.style.styleSpecialPrice} price={this.prices.price_including_tax.price} />
                    </View>
                );
                sale_off = 100 - (this.prices.price_including_tax.price / this.prices.regular_price) * 100;
                sale_off = parseFloat(sale_off).toFixed(0);
                price_label = (
                    // <Text style={this.parent.style.styleLabel}>
                    <Format price={this.prices.regular_price} style={this.parent.style.stylePriceLine} />
                    //     <Text style={this.parent.style.styleDiscount}>-{sale_off}%</Text>
                    // </Text>
                );
                return (
                    <View style={{ flexWrap: 'wrap' }}>
                        {price_excluding_tax}
                        {price_including_tax}
                        {price_label}
                    </View>
                )
            } else {
                price = (<Format price={this.prices.price} style={[this.parent.style.styleSpecialPrice, { fontSize: material.isTablet ? 20 : 16 }]} />);
                if (this.prices.show_weee_price != null && this.prices.show_weee_price == 1) {
                    weee = <View>{this.prices.weee}</View>
                }
                sale_off = 100 - (this.prices.price / this.prices.regular_price) * 100;
                sale_off = sale_off.toFixed(0);
                price_label = (
                    // <Text style={this.parent.style.styleLabel}>
                    <Format price={this.prices.regular_price} style={this.parent.style.stylePriceLine} />
                    //     <Text style={this.parent.style.styleDiscount}>-{sale_off}%</Text>
                    // </Text>
                );
                return (
                    <View style={this.parent.style.styleOneRowPrice}>
                        {price_label}
                        {price}
                    </View>
                );
            }
        } else {
            if (this.prices.show_ex_in_price != null && this.prices.show_ex_in_price == 1) {
                if (this.prices.show_from_to_tax_price == 1) {
                    from_to_tax_price = (
                        <View>
                            <Text>{Identify.__('Form')}</Text>
                            <View style={this.parent.style.styleOneRowPrice}>
                                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.from_price_excluding_tax.label) + ': '}</Text>
                                <Format price={this.prices.from_price_excluding_tax.price} style={this.parent.style.stylePrice} />
                            </View>
                            <View style={this.parent.style.styleOneRowPrice}>
                                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.from_price_including_tax.label) + ': '}</Text>
                                <Format price={this.prices.from_price_including_tax.price} style={this.parent.style.stylePrice} />
                            </View>
                            <Text>{Identify.__('To')}</Text>
                            <View style={this.parent.style.styleOneRowPrice}>
                                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.to_price_excluding_tax.label) + ': '}</Text>
                                <Format price={this.prices.to_price_excluding_tax.price} style={this.parent.style.stylePrice} />
                            </View>
                            <View style={this.parent.style.styleOneRowPrice}>
                                <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.to_price_including_tax.label) + ': '}</Text>
                                <Format price={this.prices.to_price_including_tax.price} style={this.parent.style.stylePrice} />
                            </View>
                        </View>
                    )
                    return from_to_tax_price;
                }
                price_excluding_tax = (
                    <View style={this.parent.style.styleOneRowPrice}>
                        <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_excluding_tax.label) + ': '}</Text>
                        <Format price={this.prices.price_excluding_tax.price} style={this.parent.style.stylePrice} />
                    </View>
                );
                if (this.prices.show_weee_price != null && this.prices.show_weee_price == 1) {
                    weee = <View>{this.prices.weee}</View>
                }
                price_including_tax = (
                    <View style={this.parent.style.styleOneRowPrice}>
                        <Text style={this.parent.style.styleLabel}>{Identify.__(this.prices.price_including_tax.label) + ': '}</Text>
                        <Format style={this.parent.style.stylePrice} price={this.prices.price_including_tax.price} />
                    </View>
                );
                if (this.prices.show_weee_price != null && this.prices.show_weee_price == 2) {
                    weee = <View>{this.prices.weee}</View>
                }
                return (
                    <View style={this.parent.style.styleTwoRowPrice}>
                        {price_excluding_tax}
                        {price_including_tax}
                    </View>
                );
            } else {
                if (this.prices.show_weee_price != null && this.prices.show_weee_price == 1) {
                    weee = <View>{this.prices.weee}</View>
                }

                price = (<View><Format price={this.prices.price} style={this.parent.style.stylePrice} /></View>);
                if (this.prices.show_weee_price != null && this.prices.show_weee_price == 2) {
                    weee = <View>{this.prices.weee}</View>
                }
            }
        }
        return (
            <View>
                {price}
                {price_label}
                {special_price_label}
                {price_excluding_tax}
                {price_including_tax}
                {weee}
                {low_price_label}
                {low_price}
                {from_to_tax_price}
            </View>)
    }

    render() {
        this.initValues();
        return (
            <View>{this.renderView()}</View>
        );
    }

    initValues() {
        this.type = this.props.type;
        this.configure = null;
        this.configurePrice = this.props.configure_price ? this.props.configure_price : null;
        this.prices = this.props.prices;
        this.parent = this.props.parent;
        this.config = this.parent.props.config;
    }

}
export default Simple;
