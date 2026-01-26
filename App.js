import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import AppRouter from './router/navigation';
import { Root } from 'native-base';
import Spinner from '@base/components/spinner';
import {
    I18nManager,
    Platform,
    DeviceEventEmitter,
    TouchableOpacity,
    NativeModules,
    AppState,
    Dimensions,
    StatusBar,
    View,
    PermissionsAndroid,
} from 'react-native';
import type { Notification, RemoteMessage, NotificationOpen } from 'react-native-firebase';
import firebase from 'react-native-firebase';
import Connection from '@base/network/Connection';
import AppStorage from '@helper/storage';
import { devices } from '@helper/constants';
import NotificationPopup from '@base/components/notification';
import VersionUpdate from '@base/components/versionUpdate';
import simicart from '@helper/simicart';
import Device from '@helper/device';
import Identify from '@helper/Identify';
import NavigationManager from '@helper/NavigationManager';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import OneSignal from 'react-native-onesignal';
import * as Sentry from '@sentry/react-native';
import { requestTrackingPermission, getTrackingStatus } from 'react-native-tracking-transparency';
import compareVersions from 'compare-versions';

Sentry.init({
    dsn: 'https://34a08d6102a64b61a33561d73f59d874@sentry.io/1783442',
    enableNative: false,
});

const PLAY_EXTRACTORS = [
    /itemprop=\"softwareVersion\"[^>]*>([^<]+)</i,
    /\[\[\[\s*\"(\d+(?:\\.\d+){1,3})\"\s*\]\]\]/,
    /Current Version[\s\S]{0,200}?([0-9]+(?:\.[0-9]+){1,3})/i,
];

function fetchWithTimeout(resource, options = {}) {
    const { timeout = 10000, ...rest } = options;
    return Promise.race([
        fetch(resource, rest),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
    ]);
}

async function fetchPlayStoreVersion(
    packageName,
    { hl = 'en', gl = 'US', timeout = 10000 } = {},
) {
    const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(
        packageName,
    )}&hl=${hl}&gl=${gl}`;
    try {
        const res = await fetchWithTimeout(url, {
            timeout,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
            },
        });
        const html = await res.text();
        for (const rx of PLAY_EXTRACTORS) {
            const m = rx.exec(html);
            if (m && m[1]) {
                const raw = String(m[1]).trim();
                const ver = raw.replace(/[^0-9.]/g, '');
                if (ver) return ver;
            }
        }
    } catch (e) {
        // ignore
    }
    return null;
}

function getPlayUrls(appId) {
    return {
        marketUrl: `market://details?id=${appId}`,
        webUrl: `https://play.google.com/store/apps/details?id=${appId}`,
    };
}

const store = createStore(reducers);

const NativeMethod =
    Platform.OS === 'ios' ? NativeModules.NativeMethod : NativeModules.NativeMethodModule;

const isAndroid15 = Platform.OS === 'android' && Number(Platform.Version) === 35;

const getAndroidSystemBars = () => {
    if (!isAndroid15) return { top: 0, bottom: 0 };
    const screen = Dimensions.get('screen');
    const window = Dimensions.get('window');

    const status = Math.max(0, StatusBar?.currentHeight || 0);
    const totalDiffH = Math.max(0, (screen?.height || 0) - (window?.height || 0));
    const nav = Math.max(0, totalDiffH - status);

    return { top: status, bottom: nav };
};

const AndroidSystemPadding = ({ children, style, ...rest }) => {
    if (!isAndroid15) {
        return (
            <View style={[{ flex: 1 }, style]} {...rest}>
                {children}
            </View>
        );
    }

    const [insets, setInsets] = React.useState(getAndroidSystemBars());

    React.useEffect(() => {
        const onChange = () => setInsets(getAndroidSystemBars());

        const sub = Dimensions.addEventListener
            ? Dimensions.addEventListener('change', onChange)
            : null;

        onChange();

        return () => {
            if (sub && typeof sub.remove === 'function') sub.remove();
            if (!sub && Dimensions.removeEventListener) {
                try {
                    Dimensions.removeEventListener('change', onChange);
                } catch (e) {}
            }
        };
    }, []);

    return (
        <View style={[{ flex: 1, paddingTop: insets.top, paddingBottom: 50 }, style]} {...rest}>
            {children}
        </View>
    );
};

export default class App extends React.Component {
    constructor(props) {
        super(props);
        I18nManager.allowRTL(true);
        I18nManager.swapLeftAndRightInRTL(true);
        I18nManager.forceRTL(I18nManager.isRTL);
        this.router = null;
        this.requestedRegisterDevice = false;

        // OneSignal classic init (the version bạn đang dùng có vẻ là API cũ)
        OneSignal.setAppId('9852516e-876e-4d44-b9b6-44975714c6f7');
        // Prevent OneSignal from auto-opening launchURL in an in-app browser.
        OneSignal.setLaunchURLsInApp(false);
        OneSignal.promptForPushNotificationsWithUserResponse((response) => {
            console.log("Prompt response:", response);
          });
      
          //Method for handling notifications received while app in foreground
          OneSignal.setNotificationWillShowInForegroundHandler(
            (notificationReceivedEvent) => {
              let notification = notificationReceivedEvent.getNotification();
              // Complete with null means don't show a notification.
              notificationReceivedEvent.complete(notification);
              // setNotificationData(notification);
              this.onReceived(notification);
            }
          );
      
          //Method for handling notifications opened
          OneSignal.setNotificationOpenedHandler(this.onOpened);
          OneSignal.setInAppMessageClickHandler((event) => {
            console.log("OneSignal IAM clicked:", event);
            if (event && event.click_name) {
              const splits = event.click_name.split("_");
              if (splits.length == 2) {
                if (splits[0] == "category") {
                  NavigationManager.openPage(null, "Products", {
                    categoryId: splits[1],
                  });
                } else if (splits[0] == "product") {
                  NavigationManager.openPage(null, "ProductDetail", {
                    productId: splits[1],
                  });
                }
              }
            }
          });
      
    }

    _handleAppStateChange = () => {
        if (AppState.currentState === 'active') {
            getTrackingStatus().then(trackingStatus => {
                if (!trackingStatus || trackingStatus === 'not-determined') {
                    requestTrackingPermission().then(newTrackingStatus => {
                        if (
                            (newTrackingStatus && newTrackingStatus === 'authorized') ||
                            newTrackingStatus === 'unavailable'
                        ) {
                            Identify.enableAppTracking();
                        }
                    });
                }
                if (
                    (trackingStatus && trackingStatus === 'authorized') ||
                    trackingStatus === 'unavailable'
                ) {
                    Identify.enableAppTracking();
                }
            });
        }
    };

    // ✅ Xin quyền notification cho Android 13+
    async requestNotificationPermissionAndroid() {
        if (Platform.OS !== 'android') return true;

        if (Platform.Version < 33) {
            return true;
        }

        const permission =
            (PermissionsAndroid.PERMISSIONS &&
                (PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS ||
                    'android.permission.POST_NOTIFICATIONS')) || null;

        if (!permission) {
            console.log(
                'POST_NOTIFICATIONS constant is not available on this RN version, skip requesting',
            );
            return true;
        }

        try {
            const granted = await PermissionsAndroid.request(permission, {
                title: 'Cho phép gửi thông báo',
                message:
                    'Ứng dụng cần quyền gửi thông báo để báo cho bạn về khuyến mãi, đơn hàng,...',
                buttonPositive: 'Cho phép',
                buttonNegative: 'Không',
            });

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log('requestNotificationPermissionAndroid error', err);
            return false;
        }
    }

    async componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener('type_device_event', e => {
                AppStorage.saveData('type_device', e);
                if (e === 'tablet') {
                    Device.is_android_tablet = true;
                } else {
                    Device.is_android_tablet = false;
                }
            });
        }

        if (simicart.isDemo === '0') {
            if (Platform.OS === 'android') {
                this.getAppInforAndroid();
            } else {
                this.getAppInforIos();
            }
        }

        setTimeout(async () => {
            // 🟢 ANDROID: xin quyền noti trước
            if (Platform.OS === 'android') {
                const granted = await this.requestNotificationPermissionAndroid();
                if (!granted) {
                    console.log('Notification permission denied, vẫn tiếp tục nhưng OS có thể chặn noti.');
                }
            }

            // 🟣 iOS: giữ logic cũ
            if (Platform.OS === 'ios') {
                NativeMethod.registerNotification();
            }

            Geolocation.getCurrentPosition(
                position => {
                    Identify.setLocation(position.coords.latitude, position.coords.longitude);
                    AppStorage.getData('notification_token').then(savedToken => {
                        if (savedToken) {
                            this.requestRegisterDevice(savedToken);
                        }
                    });
                },
                error => {
                    console.log(error);
                },
                { enableHighAccuracy: false, timeout: 50000 },
            );

            this.registerNotificationListener();
        }, 5000);
    }

    getAppInforIos() {
        fetch('http://itunes.apple.com/lookup?bundleId=' + simicart.appID)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                const errors = {};
                errors.errors = [{ message: Identify.__('Network response was not ok') }];
                return errors;
            })
            .then(data => {
                if (data.errors) {
                    console.log(data.errors);
                } else if (
                    data.results.length > 0 &&
                    this.isNeedUpdate(simicart.appVersion, data.results[0].version)
                ) {
                    // show VersionUpdate ở đây nếu muốn
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    async getAppInforAndroid() {
        try {
            const latest = await fetchPlayStoreVersion(simicart.appID);
            if (!latest) {
                return;
            }
            const current = simicart.appVersionAndroid;
            console.log(`Version data: ${latest}, ${current}`);

            if (this.isNeedUpdate(current, latest)) {
                const { marketUrl, webUrl } = getPlayUrls(simicart.appID);
                setTimeout(() => {
                    store.dispatch({
                        type: 'showUpdate',
                        data: {
                            show: true,
                            urlApp: webUrl,
                            marketUrl: marketUrl,
                            latestVersion: latest,
                        },
                    });
                }, 7000);
            }
        } catch (e) {
            console.log('getAppInforAndroid error', e);
        }
    }

    isNeedUpdate(currentVersion, appVersion) {
        return compareVersions(currentVersion, appVersion) === -1;
    }

    requestRegisterDevice(token) {
        let platformID = '3';
        if (Platform.OS === 'ios') {
            if (Device.isTablet()) {
                platformID = '2';
            } else {
                platformID = '1';
            }
        }

        let locationParams = {};
        const location = Identify.getLocation();
        if (location) {
            locationParams = {
                latitude: location.lat,
                longitude: location.lng,
            };
        }

        Connection.restData();
        Connection.setBodyData({
            device_token: token,
            is_demo: simicart.isDemo,
            plaform_id: platformID,
            app_id: simicart.appID,
            build_version: simicart.appVersion,
            ...locationParams,
        });
        Connection.connect(devices, this, 'POST');
    }

    setData(data) {
        if (data.device) {
            AppStorage.saveData('notification_token', data.device.device_token);
        }
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        // nếu có this.messageListener / notificationListener thì nên remove ở đây
    }

    render() {
        return (
            <Provider store={store}>
                {Platform.OS === 'android' ? (
                    <AndroidSystemPadding>
                        <Root>
                            <AppRouter />
                            <Spinner />
                            <NotificationPopup />
                            <VersionUpdate />
                        </Root>
                    </AndroidSystemPadding>
                ) : (
                    <Root>
                        <AppRouter />
                        <Spinner />
                        <NotificationPopup />
                        <VersionUpdate />
                    </Root>
                )}
            </Provider>
        );
    }

    registerNotificationListener() {
        if (Platform.OS === 'ios') {
            const context = this;
            PushNotificationIOS.requestPermissions();
            PushNotificationIOS.addEventListener('register', function (token) {
                if (!this.requestedRegisterDevice) {
                    this.requestedRegisterDevice = true;
                    AppStorage.getData('notification_token').then(savedToken => {
                        if (!savedToken || (savedToken && token !== savedToken)) {
                            context.requestRegisterDevice(token);
                        }
                    });
                }
            });
        }

        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            if (message && message._data && message._data.message) {
                console.log('Message Received');
                console.log(message);
                const data = JSON.parse(message._data.message);
                if (data.show_popup === '1') {
                    store.dispatch({
                        type: 'showNotification',
                        data: { show: true, data: data },
                    });
                } else {
                    this.pushNotiStatusBar(data);
                }
            }
        });

        this.notificationListener = firebase
            .notifications()
            .onNotification((notification: Notification) => {
                if (notification && notification._data) {
                    console.log('Notification Received');
                    console.log(notification);
                    const data = notification._data;
                    if (data.show_popup) {
                        store.dispatch({
                            type: 'showNotification',
                            data: { show: true, data: data },
                        });
                    } else {
                        this.pushNotiStatusBar(data);
                    }
                }
            });

        this.notificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened((notificationOpen: NotificationOpen) => {
                const notification: Notification = notificationOpen.notification;
                console.log(notification);
                let data = {};
                if (notification._data || notification._android) {
                    if (Platform.OS === 'ios') {
                        data = notification._data;
                    } else {
                        data = notification._android._notification._data;
                    }
                    console.log('Opened Received');
                    console.log(data);
                    store.dispatch({
                        type: 'showNotification',
                        data: { show: true, data: data },
                    });
                }
            });

        if (Platform.OS !== 'ios') {
            const channel = new firebase.notifications.Android.Channel(
                simicart.appID,
                simicart.appID,
                firebase.notifications.Android.Importance.Max,
            ).setDescription(simicart.appID + ' notification channel');
            firebase.notifications().android.createChannel(channel);
        }
    }

    pushNotiStatusBar(data) {
        const notification = new firebase.notifications.Notification()
            .setNotificationId(Identify.makeid())
            .setTitle(data.title ? data.title : data.notice_title)
            .setBody(data.message ? data.message : data.notice_content)
            .setData(data);

        notification
            .android.setChannelId(simicart.appID)
            .android.setSmallIcon('@drawable/ic_launcher')
            .android.setAutoCancel(true);

        if (data.image_url && data.image_url !== null && data.image_url !== '') {
            notification.android.setLargeIcon(data.image_url).android.setBigPicture(data.image_url);
        }

        firebase.notifications().displayNotification(notification);
    }

    openNotification(notification) {
        const type = notification.type;
        let routeName = '';
        let params = {};

        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: notification.productID
                        ? notification.productID
                        : notification.product_id,
                };
                break;
            case '2':
                if (notification.has_child) {
                    routeName = 'Category';
                    params = {
                        categoryId: notification.categoryID
                            ? notification.categoryID
                            : notification.category_id,
                        categoryName: notification.categoryName
                            ? notification.categoryName
                            : notification.category_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: notification.categoryID
                            ? notification.categoryID
                            : notification.category_id,
                        categoryName: notification.categoryName
                            ? notification.categoryName
                            : notification.category_name,
                    };
                }
                break;
            case '3':
                routeName = 'WebViewPage';
                params = {
                    uri: notification.url ? notification.url : notification.notice_url,
                };
                break;
            default:
                break;
        }
        if (routeName !== '') {
            NavigationManager.openRootPage(null, routeName, params);
        }
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
        const payload = (notification && notification.payload) ? notification.payload : notification;
        let notiData = {
            payload,
        };
        notiData["is_onesignal"] = "1";
        store.dispatch({
            type: "showNotification",
            data: { show: true, data: notiData },
        });
    }
    
    onOpened(openResult) {
        console.log("Notification opened: ", openResult);
        const notification = openResult && openResult.notification ? openResult.notification : null;
        const payload = (notification && notification.payload) ? notification.payload : notification;
        let notiData = {
            payload,
        };
        notiData["is_onesignal"] = "1";
        const launchUrl =
            (payload && (payload.launchURL || payload.launchUrl)) ||
            (notification && (notification.launchURL || notification.launchUrl)) ||
            null;
        if (launchUrl) {
            Identify.saveInitNotiOpened(true);
            Identify.saveNotificationLaunchUrl(launchUrl);
        }
        setTimeout(() => {
            store.dispatch({
            type: "showNotification",
            data: { show: true, data: notiData },
        })}, 5000);
    }
    

    onIds(device) {
        console.log('Device info: ', device);
    }
}

TouchableOpacity.defaultProps = {
    activeOpacity: 0.5,
    delayPressIn: 30,
};
