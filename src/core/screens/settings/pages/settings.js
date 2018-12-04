import React from 'react';
import { connect } from 'react-redux';
import { Modal, NativeModules, Platform } from 'react-native';
import Identify from '../../../helper/Identify';
import AdvanceList from '../../../base/components/advancelist/index';
import { Container, Content} from "native-base";
import Connection from '../../../base/network/Connection';
import { storeviews } from '../../../helper/constants';
import AppStorage from '../../../helper/storage';
import RNRestart from 'react-native-restart';
import { I18nManager } from 'react-native';
import SimiPageComponent from "../../../base/components/SimiPageComponent";
import variable from '@theme/variables/material';

const NativeMethod = Platform.OS === 'ios' ? NativeModules.NativeMethod : NativeModules.NativeMethodModule;

class Viewsettings extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            modalVisible: false,
            data: [], title: "Search"
        };
        this.stores = null;
        this.baseStore = this.props.data.storeview.base;
        let stores = null;
        this.storeName = '';
        if (!Identify.isEmpty(this.props.data.storeview.stores) && parseInt(this.props.data.storeview.stores.total) >= 1) {
            stores = this.props.data.storeview.stores.stores;
        }
        stores.forEach(item => {
            if(item.group_id == this.baseStore.group_id){
                this.storeName = item.name
            }
        })
    }
    getDataToShow(key, hasDataInParent){
        if(key){
            return this.baseStore[key]
        }else if(hasDataInParent){
            return this.storeName
        }else return null
    }
    getDefaultStoreViewByGroupId(value) {
        let stores = this.props.data.storeview.stores.stores
        for (let i in stores) {
            let store = stores[i];
            if (store.group_id == value) return store.default_store_id;
        }
        return null;
    }
    //0 - store, 1 lanauge, 2 currency.
    handleSelected(type, value, item = null) {
        // this.props.storeData('showLoading', { type: 'dialog' });
        this.state.modalVisible = false;
        this.showLoading('dialog');

        let api = storeviews;
        if (!value) return;
        let keys = [
            {key: 'currency_code'}
        ];
        let params = [];
        if (type == 0) {
            if (value == this.baseStore.group_id) {
                this.showLoading('none', true);
                return;
            }
            let storeDefaultId = this.getDefaultStoreViewByGroupId(value);
            if (storeDefaultId == null) return;
            api += "/" + storeDefaultId;
            Identify.store_id = storeDefaultId;
            Connection.restData();
        } else if (type == 1) {
            if (value == this.baseStore.store_id) {
                this.showLoading('none', true);
                return;
            }
            api += "/" + value;
            Identify.store_id = value;
            Connection.restData();
        } else {
            if (value == this.baseStore.currency_code) {
                this.showLoading('none', true);
                return;
            }
            api += "/" + this.baseStore.store_id;
            params['currency'] = value;
            Connection.setGetData(params)
        }

        Connection.connect(api, this, 'GET');

    }
    setData(data) {
        this.props.clearData();
        Connection.setMerchantConfig(data);

        if (data.storeview.hasOwnProperty('base') && data.storeview.base.hasOwnProperty('locale_identifier')) {
            Identify.locale_identifier = data.storeview.base.locale_identifier;
        }

        this.showLoading('none', false);
        this.props.storeData('merchant_configs', data);

        if(data.storeview.base.is_rtl == '1') {
            I18nManager.forceRTL(true);
        } else {
            I18nManager.forceRTL(false);
        }

        this.props.navigation.goBack(null)
        //
        AppStorage.saveData('store_id', data.storeview.base.store_id).then(
            () => {
                AppStorage.saveData('currency_code', data.storeview.base.currency_code).then(
                    () => {RNRestart.Restart()}
                )
            }
        )
    }
    showModal(data = "", title = "") {
        this.setState(previousState => { return { modalVisible: !previousState.modalVisible, data: data, title: title }; });
    }

    renderModal() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                presentationStyle="fullScreen"
                visible={this.state.modalVisible}
                onRequestClose={() => { }}>
                <AdvanceList parent={this} data={this.state.data} title={this.state.title} value={this.state.value} />
            </Modal>
        );
    }

    generateActionForModal(dataContainer, title, keyItem, type, noMatch=false, extraData={searchStr: '', baseData: ''}){
        let compareData = noMatch ? this.baseStore[extraData.baseData] : this.baseStore[keyItem];
        let data = [];
        for (let i in dataContainer) {
            let sv = dataContainer[i];
            let ssv = { searchStr: noMatch ? sv[extraData.searchStr] : sv.name, key: sv[keyItem], selected: false, type };
            if (sv[keyItem] == compareData) {
                ssv['selected'] = true;
            }
            data.push(ssv);
        }
        this.showModal(data, title)
    }

    itemAction(keyItem, title){
        switch (keyItem){
            case 'store':
                let stores = null;
                if (!Identify.isEmpty(this.props.data.storeview.stores) && parseInt(this.props.data.storeview.stores.total) >= 1) {
                    stores = this.props.data.storeview.stores.stores;
                }
                if (stores) {
                    this.generateActionForModal(stores,title, 'group_id', 0)
                }
                return null;
                break;
            case 'language':
                let storeView = null;
                if (!Identify.isEmpty(this.props.data.storeview.stores) && parseInt(this.props.data.storeview.stores.total) >= 1) {
                    this.stores = this.props.data.storeview.stores.stores;
                    let groupId = this.baseStore.group_id;
                    for (let i in this.stores) {
                        let store = this.stores[i];
                        if (store.group_id == groupId) {
                            storeView = parseInt(store.storeviews.total) > 1 ? store.storeviews.storeviews : null;
                        }
                    }
                }
                if (storeView) {
                    this.generateActionForModal(storeView, title, 'store_id', 1)
                }
                return null;
                break;
            case 'currency':
                let currenies = null;
                if (!Identify.isEmpty(this.baseStore.currencies)) {
                    currenies = this.baseStore.currencies;
                }
                if (currenies) {
                    this.generateActionForModal(currenies, title, 'value', 2, true, {searchStr: 'title', baseData: 'currency_code'})
                }
                return null;
                break;
            default:
                NativeMethod.openSetting();
                break;
        }
    }

    renderPhoneLayout() {
        return (
            <Container style={{paddingLeft: 15, paddingRight: 15, backgroundColor: variable.appBackground}}>
                {this.renderModal()}
                <Content style={{ flex: 1, paddingTop: 15 }}>
                    {this.renderLayoutFromConfig('setting_layout', 'content')}
                </Content>
                {this.renderLayoutFromConfig('setting_layout', 'container')}
            </Container>
        )
    }
}

//export default Settings;
const mapStateToProps = (state) => {
    return { data: state.redux_data.merchant_configs };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (type, data) => {
            dispatch({ type: type, data: data })
        },
        clearData: () => {
            dispatch({ type: 'clear_all_data' })
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewsettings);
