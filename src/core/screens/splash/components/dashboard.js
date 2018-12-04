import React from 'react';
import {connect} from 'react-redux';
import Connection from '@base/network/Connection';
import { Content } from 'native-base';
import Spinner from '@base/components/spinner';
import Identify from '@helper/Identify';
import Layout from '@helper/config/layout';
import Events from '@helper/config/events';

class Dashboard extends React.Component {
  componentDidMount() {
    Connection.restData();
    Connection.connectSimiCartServer('GET',this);
  }
  setData(data) {
    Identify.setAppConfig(data['app-configs'][0]);

    Layout.plugins = data['app-configs'][0]['site_plugins'] || [];
    Layout.initAppLayout();

    Events.plugins = data['app-configs'][0]['site_plugins'] || [];
    Events.initAppEvents();

    this.props.storeData(data);
  }

  render(){
    return (null);
  }
}

const mapStateToProps = (state) => {
    return {data: state.redux_data};
}
const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({type: 'dashboard_configs', data: data})
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

// export default Settings;
