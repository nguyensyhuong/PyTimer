import React from 'react';
import { connect } from 'react-redux';
import Connection from '../../core/base/network/Connection';
import { customizepayments } from '../../core/helper/constants';
import Identify from '../../core/helper/Identify';

class CustomPayment extends React.Component {
    componentDidMount() {
        if (Identify.isEmpty(this.props.data.customPayment)) {
            Connection.restData();
            Connection.connect(customizepayments, this, 'GET');
        }
    }
    setData(data) {
        this.props.storeData(data.customizepayments);
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
            dispatch({ type: 'customPayment', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomPayment);