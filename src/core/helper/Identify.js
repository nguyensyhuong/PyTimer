import React from 'react';
import md5 from 'md5';
import Language from '../base/components/language';
import Connection from '../base/network/Connection';
import SimiCart from './simicart';

class Identify {
    static language = null;
    static theme = null;
    static appConfig = null;
    static locale_identifier = null;
    static store_id = "default";
    static plugins = [];

    static setAppConfig(config) {
        this.language = config.language || null;
        this.theme = config.theme || null;
        this.appConfig = config;
        this.plugins = config['site_plugins'] || [];
    }
    static getSimiCartConfig() {
        return {
            merchant_url: SimiCart.merchant_url,
            api_path: "",
            simicart_url: SimiCart.simicart_url,
            simicart_authorization: SimiCart.simicart_authorization,
        };
    }

    static getMerchantConfig() {
        return Connection.getMerchantConfig();
    }

    static isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    static __(text) {
        if (Identify.language !== null && Identify.locale_identifier !== null) {
            let laguageWithCode = Identify.language[Identify.locale_identifier];
            if (laguageWithCode && laguageWithCode.hasOwnProperty(text)) {
                return laguageWithCode[text];
            }
        }
        return text;
    }

    static makeid() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 20; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return md5(text + Date.now());
    }

    static isRtl() {
        let is_rtl = false;
        let configs = this.getMerchantConfig();
        if (configs !== null) {
            is_rtl = parseInt(configs.storeview.base.is_rtl) === 1;
        }
        return is_rtl;
    }

    static formatPrice(price, type = 0) {
        if (typeof (price) != "number") {
            price = parseFloat(price);
        }
        //let merchant_config = JSON.parse(localStorage.getItem('merchant_config'));
        let merchant_config = this.getMerchantConfig();
        if (merchant_config !== null) {
            let currency_symbol = merchant_config.storeview.base.currency_symbol || merchant_config.storeview.base.currency_code;
            let currency_position = merchant_config.storeview.base.currency_position;
            let decimal_separator = merchant_config.storeview.base.decimal_separator;
            let thousand_separator = merchant_config.storeview.base.thousand_separator;
            let max_number_of_decimals = merchant_config.storeview.base.max_number_of_decimals;
            if (type === 1) {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            }
            if (currency_position == "before") {
                return currency_symbol + Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            } else {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals) + currency_symbol;
            }
        }

    }

    static formatPriceWithCurrency(price, currency_symbol, type = 0) {
        if (typeof (price) != "number") {
            price = parseFloat(price);
        }
        let merchant_config = this.getMerchantConfig();
        if (merchant_config !== null) {
            let currency_position = merchant_config.storeview.base.currency_position;
            let decimal_separator = merchant_config.storeview.base.decimal_separator;
            let thousand_separator = merchant_config.storeview.base.thousand_separator;
            let max_number_of_decimals = merchant_config.storeview.base.max_number_of_decimals;
            if (type === 1) {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            }
            if (currency_position == "before") {
                return currency_symbol + Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals);
            } else {
                return Identify.putThousandsSeparators(price, thousand_separator, decimal_separator, max_number_of_decimals) + currency_symbol;
            }
        }

    }

    static putThousandsSeparators(value, sep, decimal, max_number_of_decimals) {
        if (!max_number_of_decimals) {
            let merchant_config = this.getMerchantConfig();
            max_number_of_decimals = merchant_config.storeview.base.max_number_of_decimals || 2;
        }

        if (sep == null) {
            sep = ',';
        }
        if (decimal == null) {
            decimal = '.';
        }

        value = value.toFixed(max_number_of_decimals);
        // check if it needs formatting
        if (value.toString() === value.toLocaleString()) {
            // split decimals
            var parts = value.toString().split(decimal)
            // format whole numbers
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
            // put them back together
            value = parts[1] ? parts.join(decimal) : parts[0];
        } else {
            value = value.toLocaleString();
        }
        return value;
    }

    static isPluginEnabled(sku) {
        if (!this.pluginsStatus)
            this.pluginsStatus = {};
        if (typeof this.pluginsStatus[sku] === "undefined" && this.plugins.length > 0) {
            let pluginEnabled = false;
            this.plugins.forEach((plugin) => {
                if (plugin.sku && (plugin.sku === sku)) {
                    if (parseInt(plugin['config']['enable'], 10) === 1) {
                        pluginEnabled = true;
                    }
                    return false;
                }
            })
            this.pluginsStatus[sku] = pluginEnabled;
        }
        return this.pluginsStatus[sku];
    }

    static isMagento2() {
        let merchant_config = this.getMerchantConfig();
        if (merchant_config !== null && merchant_config.storeview.base.magento_version && merchant_config.storeview.base.magento_version == '2') {
            return true;
        }
        return false;
    }
}

export default Identify;
