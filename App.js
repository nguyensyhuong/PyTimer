import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import AppRouter from './router/navigation';
import { Root } from 'native-base';
import Spinner from './src/core/base/components/spinner';
import { I18nManager, NativeModules, Platform, NativeEventEmitter } from 'react-native';
import type { Notification, RemoteMessage, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase';
import Connection from './src/core/base/network/Connection';
import AppStorage from './src/core/helper/storage';
import { devices } from './src/core/helper/constants';
import NotificationPopup from './src/core/base/components/notification';
import VersionUpdate from './src/core/base/components/versionUpdate'
import VersionCheck from 'react-native-version-check';

const store = createStore(reducers);

const nativeMethod = Platform.OS === 'ios' ? NativeModules.NativeEvent : null;

const notificationTokenEmitter = nativeMethod != null ? new NativeEventEmitter(nativeMethod) : null;

const subscription = notificationTokenEmitter != null ? notificationTokenEmitter.addListener(
    'TokenReceived',
    (event) => {
        let token = event.token;

        AppStorage.getData('notification_token').then((savedToken) => {
            if (!savedToken || (savedToken && token !== savedToken)) {
                Connection.restData();
                Connection.setBodyData({
                    device_token: token,
                    is_demo: '1',
                    plaform_id: '1',
                    app_id: 'com.simicart',
                    build_version: '1'
                });
                Connection.connect(devices, null, 'POST');
            }
        });
    }
) : null;

const AppStore = Platform.OS === 'ios' ? VersionCheck.getAppStoreUrl() : VersionCheck.getPlayStoreUrl();

export default class App extends React.Component {
    constructor(props) {
        super(props);
        I18nManager.allowRTL(true);
        I18nManager.swapLeftAndRightInRTL(true);
        I18nManager.forceRTL(I18nManager.isRTL);
        this.router = null;
    }
    componentDidMount() {
        let currentVersion = VersionCheck.getCurrentVersion();
        let latestVersion = VersionCheck.getLatestVersion();

        VersionCheck.needUpdate({
            currentVersion: currentVersion,
            latestVersion: latestVersion
        }).then(res => {
            if(res.isNeeded){
               AppStore.then(url => {
                        setTimeout(
                            () => { store.dispatch( { type: 'showUpdate' , data : { show: true, urlApp: url } } ) }, 7000
                        )
                    }
               )
            }
        });

        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            console.log('Message Received');
            console.log(message);
            store.dispatch({ type: 'showNotification', data: { show: true, data: JSON.parse(message._data.message) } });
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log('Notification Received');
            console.log(notification);
            store.dispatch({ type: 'showNotification', data: { show: true, data: notification._data } });
        });
        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    const action = notificationOpen.action;
                    const notification: Notification = notificationOpen.notification;
                    console.log('App opened from notification');
                    console.log(notification);

                    store.dispatch({ type: 'showNotification', data: { show: true, data: notification._data } });
                }
            });

        if (Platform.OS !== 'ios') {
            const channel = new firebase.notifications.Android.Channel('com.simicart', 'SimiCart', firebase.notifications.Android.Importance.Max)
                .setDescription('SimiCart notification channel');
            firebase.notifications().android.createChannel(channel);
        }
    }
    componentWillUnmount() {
        this.messageListener();
        this.notificationListener();
        if (subscription != null) {
            subscription.remove();
        }
    }
    render() {
        return (
            <Provider store={store}>
                <Root>
                    <AppRouter />
                    <Spinner />
                    <NotificationPopup />
                    <VersionUpdate />
                </Root>
            </Provider>
        );
    }
}
