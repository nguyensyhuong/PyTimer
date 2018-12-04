import md5 from 'md5';
import Identify from '../../helper/Identify';
import { Alert } from 'react-native';

class Connection {

    s = 'KLXYZXXOQCOvY9ZuuwvAdmopMPQjoj';

    constructor() {
        let current = this;
        this._loading = true;
        this._dataGet = null;
        this._dataPost = null;
        this._headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + md5(this.s),
        });
        // this._init = {cache: 'default', mode: 'cors'};
        this._init = { credentials: 'include' };
        this.merchantConfig = null;
        this.customer = null;
        this.config = Identify.getSimiCartConfig();
        this.fullUrl = "";
    }
    getFullUrl() {
        return this.fullUrl;
    }
    setCustomer(customer) {
        this.customer = customer;
    }

    getCustomer() {
        return this.customer;
    }

    setMerchantConfig(config) {
        this.merchantConfig = config;
    }

    getMerchantConfig() {
        return this.merchantConfig;
    }

    setHeader(key, value) {
        this._headers.set(key, value);
    }

    setInitConfig(key, value) {
        this._init[key] = value;
    }

    setHttpMethod(method) {
        this._init['method'] = method;
    }

    setLoading(isLoad) {
        this._loading = isLoad;
    }

    restData() {
        this._dataGet = null;
        this._dataPost = null;
        this._init['body'] = null;
    }

    //param is array
    setGetData(data) {
        this._dataGet = Object.keys(data).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(data[key]);
        }).join('&');
    }

    //param is JSON
    setBodyData(data) {
        this._dataPost = JSON.stringify(data);
    }

    /**
     * param url - api resources/{id}/nested_resources/{nested_id}?refines
     * param obj - object that call to Api.
     **/
    connect(url, obj, method = 'GET', showErrorAlert = true) {
        let _fullUrl = this.config.merchant_url;
        if (this.merchantConfig !== null) {
            if (parseInt(this.merchantConfig.storeview.base.use_store) === 1) {
                _fullUrl = this.merchantConfig.storeview.base.base_url || this.config.merchant_url;

            }
        }
        if (_fullUrl.lastIndexOf('/') !== _fullUrl.length - 1) {
            _fullUrl += '/'
        }

        _fullUrl += this.config.api_path;
        this.fullUrl = _fullUrl;
        _fullUrl += url;
        if (this.customer !== null) {
            _fullUrl += "?email=" + this.customer.email + "&password=" + this.customer.password;
            if (this._dataGet) {
                _fullUrl += "&" + this._dataGet;
            }
        } else {
            if (this._dataGet) {
                _fullUrl += "?" + this._dataGet;
            }
        }

        let merchantConfig = this.merchantConfig;
        if (method.toUpperCase() === 'PUT') {
            if (merchantConfig !== null) {
                if (merchantConfig.storeview !== undefined && merchantConfig.storeview.base.is_support_put !== undefined
                    && parseInt(merchantConfig.storeview.base.is_support_put) === 0) {
                    method = 'POST';
                    if (this._dataGet) {
                        _fullUrl += "&is_put=";
                    } else {
                        if (_fullUrl.includes('?'))
                            _fullUrl += "&is_put=1";
                        else
                            _fullUrl += "?is_put=1";
                    }

                }
            }
        }

        if (method.toUpperCase() === 'DELETE') {
            if (merchantConfig !== null) {
                if (merchantConfig.storeview !== undefined && merchantConfig.storeview.base.is_support_delete !== undefined
                    && parseInt(merchantConfig.storeview.base.is_support_delete) === 0) {
                    method = 'POST';
                    if (this._dataGet) {
                        _fullUrl += "&is_delete=1";
                    } else {
                        if (_fullUrl.includes('?'))
                            _fullUrl += "&is_delete=1";
                        else
                            _fullUrl += "?is_delete=1";
                    }

                }
            }
        }
        console.log(_fullUrl);
        this._init['headers'] = this._headers;
        this._init['method'] = method;
        // this._init['credentials'] = 'same-origin';
        if (this._dataPost) {
            this._init['body'] = this._dataPost;
            console.log(JSON.stringify(this._init['body']));
        }
        if (method === 'GET') {
            this._init['body'] = null;
        }

        let _request = new Request(_fullUrl, this._init);
        fetch(_request)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                let errors = {};
                errors['errors'] = [
                    { message: 'Network response was not ok' }
                ]
                return errors;
                //throw new Error();
            })
            .then(function (data) {
                //console.log(data);
                //set data to obj.
                //  if (obj._mounted) {
                if (data.errors) {
                    let hasHandleMethod = false;
                    if (typeof obj.handleWhenRequestFail !== "undefined") {
                        obj.handleWhenRequestFail();
                        hasHandleMethod = true;
                    }
                    let errors = data.errors;
                    let error = errors[0];
                    let message = error.message;
                    if (showErrorAlert) {
                        if (hasHandleMethod) {
                            setTimeout(() => {
                                Alert.alert(
                                    'Error',
                                    message,
                                );
                            }, 300);
                        } else {
                            Alert.alert(
                                'Error',
                                message,
                            );
                        }
                    }
                } else {
                    obj.setData(data);
                }
                // obj.setLoaded(true);
                //}
            }).catch((error) => {
                obj.handleWhenRequestFail();
                Alert.alert(
                    'Error',
                    'Something went wrong'
                );
                console.log(error);
            });
    }

    /**
     * param method - simicart server
     **/
    async connectSimiCartServer(method = 'GET', obj = null, forceUpdate = false) {
        let _fullUrl = this.config.simicart_url + 'bear_token/' + this.config.simicart_authorization;
        let _init = {};
        _init['method'] = method;
        //_init['credentials'] = 'omit';
        //_init['mode'] = 'cors';
        console.log(_fullUrl);
        var _request = new Request(_fullUrl, _init);
        await fetch(_request)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(function (data) {
                // Identify.storeDataToStoreage(Identify.SESSION_STOREAGE, Constants.SIMICART_CONFIG, data);
                // if (forceUpdate === true && obj !== null) {
                //     obj.forceUpdate();
                // }
                if (obj != null) {
                    obj.setData(data);
                }
            }).catch((error) => {
                console.warn(error);
            });
    }
}


const connection = new Connection();
export default connection;
