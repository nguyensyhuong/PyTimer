import React from 'react';
import { connect } from 'react-redux';
import Connection from '@base/network/Connection';
import { category } from '@helper/constants';
import { Content } from "native-base";
import Identify from '@helper/Identify';
import SimiPageComponent from "@base/components/SimiPageComponent";
import variable from '@theme/variables/material';

class Category extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.categoryData = null;
        this.cateId = this.props.navigation.getParam("categoryId") ? this.props.navigation.getParam("categoryId") : -1;
        this.showViewAll = (Identify.getMerchantConfig().storeview.catalog.frontend.is_show_link_all_product === '1') ? true : false;
        if (this.props.navigation.getParam("categoryName")) {
            this.cateName = this.props.navigation.getParam("categoryName");
        } else {
            this.cateName = Identify.__('All Categories');
        }
        this.title = this.cateName;
    }

    componentWillMount() {
        if (this.props.data.showLoading.type === 'none' && !this.checkExistData(this.props.data.category_data, this.cateId)) {
            this.props.storeData('showLoading', { type: 'full' });
        }
    }

    componentDidMount() {
        if (!this.categoryData) {
            Connection.restData();
            Connection.setGetData({
                limit: 100
            });
            if (this.cateId !== -1) {
                Connection.connect(category + '/' + this.cateId, this, 'GET');
            } else {
                Connection.connect(category, this, 'GET');
            }
        }
    }
    setData(data) {
        this.categoryData = data;
        let categoryData = {};
        categoryData[this.cateId] = data;
        this.props.storeData('actions', [
            { type: 'showLoading', data: { type: 'none' } },
            { type: 'add_category_data', data: categoryData }
        ]);
    }

    loadExistData(data) {
        this.categoryData = data;
        return true;
    }

    shouldRenderLayoutFromConfig() {
        if (this.categoryData) {
            return true;
        }
        return false;
    }

    shouldShowComponent(element) {
        if(element.id == 'default_catalog_products_list' && !this.showViewAll) {
            return false;
        }
        return true;
    }

    renderPhoneLayout() {
        return (
            <Content style={{backgroundColor: variable.appBackground}}>
                {this.renderLayoutFromConfig('catalog_layout', 'content')}
            </Content>
        );
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
export default connect(mapStateToProps, mapDispatchToProps)(Category);