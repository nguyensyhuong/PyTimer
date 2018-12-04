import React from 'react';
import { View } from 'native-base';
import Simple from './simple';
import Bundle from './bundle';
import Grouped from './grouped';
import PropTypes from 'prop-types';
import material from '../../../../../../../native-base-theme/variables/material';

class Price extends React.Component {
    constructor(props) {
        super(props);
        this.isUpdatePrice = false;
        this.state = {
            prices: {}
        };
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }
    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    renderView() {
        if (this.type === "bundle") {
            return <Bundle prices={this.state.prices} parent={this} />
        }
        else if (this.type === "grouped") { // for list page
            return <Grouped prices={this.state.prices} parent={this} />
        }
        else {
            ////simple, configurable ....
            return <Simple prices={this.state.prices} parent={this} />
        }
    }

    render() {
        if (!this.isUpdatePrice) {
            this.initPrices();
        } else {
            this.isUpdatePrice = false;
        }
        return (
            <View>{this.renderView()}</View>
        );
    }

    updatePrices(newPrices) {
        this.isUpdatePrice = true;
        this.setState({ prices: newPrices });
    }

    initPrices() {
        this.type = this.props.type;
        this.configure = null;
        this.configurePrice = this.props.configure_price ? this.props.configure_price : null;
        this.state.prices = this.props.prices;
        this.style = {
            styleLabel: this.props.styleLabel ? this.props.styleLabel : { fontSize: material.textSizeSmall },
            stylePrice: this.props.stylePrice ? this.props.stylePrice : { fontSize: material.textSizeSmall, color: material.priceColor },
            stylePriceLine: this.props.stylePriceLine ? this.props.stylePriceLine : { fontSize: material.textSizeSmall, textDecorationLine: 'line-through', color: material.priceColor },
            styleSpecialPrice: this.props.styleSpecialPrice ? this.props.styleSpecialPrice : { fontSize: material.textSizeSmall, color: material.secpicalPriceColor },
            //one row.
            styleOneRowPrice: this.props.styleOneRowPrice ? this.props.styleOneRowPrice : { flexWrap: 'wrap', flexDirection: 'row' },
            styleTwoRowPrice: this.props.styleTwoRowPrice ? this.props.styleTwoRowPrice : { flexWrap: 'wrap', flexDirection: 'column' },
            styleDiscount: this.props.styleDiscount ? this.props.styleDiscount : { fontSize: 9 }
        }
    }

}

Price.defaultProps = {
    prices: 0,
    type: 'simple'

};
Price.propTypes = {
    type: PropTypes.string
};


export default Price;
