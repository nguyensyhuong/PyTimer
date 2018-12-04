import Firebase from 'react-native-firebase';
import Connection from '@base/network/Connection';
import Identify from '@helper/Identify';

const Action = (params, obj=null, key=null) => {
  let Analytics = Firebase.analytics();
  let data =  {...params}
  let action = data['event'];
  delete data['event'];
  if(Connection.getCustomer()){
    data['customer_identity'] = Connection.getCustomer().email;
  }else{
    data['customer_identity'] = Connection.getMerchantConfig() ? Connection.getMerchantConfig().storeview.base.customer_identity:'';
  }
  data['customer_ip'] =  Connection.getMerchantConfig() ? Connection.getMerchantConfig().storeview.base.customer_ip: '';
  data['theme'] =  Identify.appConfig ? Identify.appConfig.home : '';
  Analytics.logEvent(action, data);
}

export default Action;
