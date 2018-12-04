import React from 'react';
import SimiPageComponent from "../../../core/base/components/SimiPageComponent";
import {Text, Container} from 'native-base';
import { connect } from 'react-redux';
import Connection from '../../../core/base/network/Connection';
import { giftcard_product } from '../../constants';
import Device from '../../../core/helper/device';
import Layout from '../../../core/helper/config/layout';
import md5 from 'md5'
import Identify from "../../../core/helper/Identify";
class ListGiftCardProducts extends SimiPageComponent{
    constructor(props){
        super(props);
        this.isBack = true;
        this.state = {
            ...this.state,
            data : null
        }
        this.layout = 'ProductGiftCardDetail'
    }

    componentWillMount(){
        if(this.props.data.showLoading.type === 'none' && !this.state.data){
            this.props.storeData('showLoading', {type: 'full'});
        }
    }

    componentDidMount(){
        Connection.restData();
        Connection.connect(giftcard_product,this, 'GET')
    }

    setData(data) {
        this.setState({data: data});
        this.props.storeData('showLoading', { type: 'none' });
    }

    shouldRenderLayoutFromConfig() {
        if (this.state.data) {
            return true;
        }
        return false;
    }

    addMorePropsToComponent(element){
        return {
            products : this.state.data.simigiftcards
        }
    }
    renderPhoneLayout(){
        return(
            <Container>
                 {this.renderLayoutFromConfig('products_layout', 'container')}
            </Container>
        )
    }
}
const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
//Save to redux.
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListGiftCardProducts);