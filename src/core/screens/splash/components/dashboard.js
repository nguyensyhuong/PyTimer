import React from 'react';
import { connect } from 'react-redux';
import NewConnection from '@base/network/NewConnection';
import Identify from '@helper/Identify';
import Layout from '@helper/config/layout';
import Events from '@helper/config/events';
import AppStorage from "@helper/storage";
import simicart from '@helper/simicart';
import { app_configs } from "@helper/constants";

class Dashboard extends React.Component {

    componentDidMount() {
        new NewConnection()
      .init(app_configs, "get_dashboard_config", this)
      .addGetData({ cache: Math.random() })
      .setShowErrorAlert(false)
      .connect();
    }

    setData(data, requestID) {
        this.saveAppConfig(data)
    }

    handleWhenRequestFail(requestID) {
        AppStorage.getData('dashboard_configs').then(results => {
            if (results && results !== undefined) {
                let dataFromStorage = JSON.parse(results)
                this.saveAppConfig(dataFromStorage, false)
            }
        })
    }

    saveAppConfig(data, shouldSaveToStorage = true) {
        Identify.setAppConfig(data['app-configs'][0]);

        data["app-configs"][0]["site_plugins"] = [
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_simicontact_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_appwishlist_40"
            },
            {
                "config": {
                    "enable": "0",
                    "config_values": ""
                },
                "sku": "simi_simibarcode_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "magestore_productlabel_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_simivideo_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_paypalexpress_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_simicustompayment_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "checkout_management_40"
            },
            {
                "config": {
                    "enable": "0",
                    "config_values": ""
                },
                "sku": "simi_simimixpanel_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_simiproductreview_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_simisocialshare_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_simicouponcode_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_searchvoice_40"
            },
            {
                "config": {
                    "enable": "0",
                    "config_values": ""
                },
                "sku": "simi_instant_purchase_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": ""
                },
                "sku": "simi_customchat_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": "{\"default\":{\"facebook_key\":\"779292439417440\",\"facebook_name\":\"PY Timber Warehouse\",\"mobile_platform\":\"1\"}}"
                },
                "sku": "simi_fblogin_40"
            },
            {
                "config": {
                    "enable": "1",
                    "config_values": "{\"default\":{\"google_plist_iso\":\"simicart\\/appdashboard\\/ios\\/plist\\/f97d42753192664120c3ba57b59c161d.plist\",\"mobile_platform\":\"1\"}}"
                },
                "sku": "simi_firebase_analytics_40"
            },
            {
                "config": {
                    "enable": "0",
                    "config_values": ""
                },
                "sku": "simi_paypalmobile_40"
            },
            {
                "config": {
                    "enable": "0",
                    "config_values": ""
                },
                "sku": "simi_simibraintree_40"
            },
            {
                "config": {
                    "enable": "0",
                    "config_values": ""
                },
                "sku": "simi_addressautofill_40"
            }
        ],

        Layout.plugins = data['app-configs'][0]['site_plugins'];
        Layout.initAppLayout();

        Events.plugins = data['app-configs'][0]['site_plugins'];
        Events.initAppEvents();

        this.props.storeData(data);

        if (shouldSaveToStorage) {
            AppStorage.saveData('dashboard_configs', JSON.stringify(data))
        }
    }

    render() {
        return (null);
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data };
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({ type: 'dashboard_configs', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
