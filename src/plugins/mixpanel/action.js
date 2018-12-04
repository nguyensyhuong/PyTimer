import Mixpanel  from 'react-native-mixpanel';
import Connection from '@base/network/Connection';
const Action = (params, obj=null, key=null) => {
  //let Analytics = Firebase.analytics();
  let data =  {...params}
  let action = data['event'];
  delete data['event'];
  if(Connection.getMerchantConfig() && Connection.getMerchantConfig().storeview.mixpanel_config.token){
    if(Connection.getCustomer()){
      data['customer_identity'] = Connection.getCustomer().email;
    }else{
      data['customer_identity'] = Connection.getMerchantConfig() ? Connection.getMerchantConfig().storeview.base.customer_identity:'';
    }
    data['customer_ip'] =  Connection.getMerchantConfig() ? Connection.getMerchantConfig().storeview.base.customer_ip: '';
    try {
      Mixpanel.trackWithProperties(action, data);
    } catch (err) {
        console.log(`Error initiating Mixpanel:`, err);
    }
  }
}

export default Action;
