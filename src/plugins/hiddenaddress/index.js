import Identify from '@helper/Identify';
import Connection from '@base/network/Connection';

export function onSplashCompleted() {
    let merchantConfig = Identify.getMerchantConfig();
    let address_option = merchantConfig.storeview.customer.address_option;
    let account_option = merchantConfig.storeview.customer.account_option;
    let address_fields_config = merchantConfig.storeview.customer.address_fields_config;
    if(address_fields_config) {
        address_option = {
            ...address_option,
            ...address_fields_config
        };
        account_option.taxvat_show = address_fields_config.taxvat_show;

        merchantConfig.storeview.customer.address_option = address_option;
        merchantConfig.storeview.customer.account_option = account_option;
    }
    Connection.setMerchantConfig(merchantConfig)
}