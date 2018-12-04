import React from 'react';
import { connect } from 'react-redux';
import Item from './item';
import { Spinner } from 'native-base';
import { View } from 'react-native';
import Identify from '@helper/Identify';
import { home_spot_products } from '@helper/constants';
import Connection from '@base/network/Connection';
 
class Products extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoading: true
        }
    }

    componentDidMount() {
        if (Identify.isEmpty(this.props.data)) {
            this.requestData();
        }
    }

    requestData() {
        Connection.restData();
        Connection.connect(home_spot_products, this, 'GET');
    }

    handleWhenRequestFail() {
        this.setState({showLoading: false});
    }

    setData(data) {
        let dataForSave = {};
        let products = data.homeproductlists;
        products.forEach(element => {
            dataForSave[element.productlist_id] = element;
        });
        this.state.showLoading = false;
        this.props.storeData('add_home_spot_data', dataForSave);
    }

    renderLoading() {
        return(
            <Spinner color={Identify.theme.key_color}/>
        );
    }

    renderHomeProductsList() {
        let row = []
        let data = this.props.data;
        for(let key in data) {
            let item = data[key];
            row.push(
                <Item key={item.productlist_id} item={item} navigation={this.props.navigation}/>)
        }
        return row;
    }

    render(){
        if(!Identify.isEmpty(this.props.data)) {
            return(
                <View>
                    {this.renderHomeProductsList()}
                </View>
            );
        } else if(this.state.showLoading) {
            return(
                <View>
                    {this.renderLoading()}
                </View>
            );
        } else {
            return(null);
        }
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.home_spot_data };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
