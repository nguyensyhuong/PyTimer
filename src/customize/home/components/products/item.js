import React from 'react';
import { FlatList } from 'react-native';
import styles from '@screens/home/pages/styles';
import { View, H3, Text } from "native-base";
import HorizontalProducts from '@screens/catalog/components/horizontalProducts';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import { products_mode, home_spot_products } from '@helper/constants';
import NewConnection from '@base/network/NewConnection';
import { connect } from 'react-redux';
import Device from '@helper/device';

class Item extends React.Component {

    componentDidMount() {
        if (this.isDataEmpty()) {
            this.requestData();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this.isDataEmpty()) {
            return false;
        }
        return true;
    }

    isDataEmpty() {
        if (this.props.homeProductlists && this.props.homeProductlists.hasOwnProperty(this.props.productlist_id)) {
            return false;
        }
        return true;
    }

    requestData() {
        let params = {
            limit: Device.isTablet() ? 16 : 10,
            offset: 0
        };
        new NewConnection()
            .init(home_spot_products + '/' + this.props.productlist_id, 'get_homeproductlist_data', this)
            .addGetData(params)
            .connect();
    }

    setData(data) {
        this.processData(data);
    }

    processData(data) {
        let homeproductlists = data.homeproductlist;
        let dataForSave = {};
        dataForSave[homeproductlists.productlist_id] = homeproductlists.product_array;
        this.props.storeData('add_home_spot_data', dataForSave);
    }

    openProductList() {
        let params = {
            categoryName: this.props.title,
            spotId: this.props.productlist_id,
            'mode': products_mode.spot
        };
        if (this.props.item.category_id && this.props.item.list_type == '6') {
            params = {
                categoryName: this.props.title,
                categoryId: this.props.item.category_id,
            };
        }
        console.log(params)
        NavigationManager.openPage(this.props.navigation, 'Products', params);
    }

    render() {
        let data = this.props.homeProductlists[this.props.productlist_id];
        if (!this.isDataEmpty()) {
            return (
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 15, alignItems: 'baseline' }}>
                        <H3>{Identify.__(this.props.title.toUpperCase())}</H3>
                        {data.products.length > 9 && <Text onPress={() => this.openProductList()} style={{ fontSize: 16 }}>{Identify.__('View All')}</Text>}
                    </View>
                    <HorizontalProducts hasData={true} products={data.products} navigation={this.props.navigation} fromHome={true} />
                </View>
            );
        } else {
            return null;
        }
    }
}
Item.defaultProps = {
    item: null
}

const mapStateToProps = (state) => {
    return {
        homeProductlists: state.redux_data.home_spot_data
    };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Item);