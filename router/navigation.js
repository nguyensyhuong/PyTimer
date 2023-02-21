import React, { Component } from "react";
import { I18nManager, Platform, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
// import CardStackStyleInterpolator from 'react-navigation';
// import { fromLeft } from 'react-navigation-transitions';
import Splash from '@screens/splash/pages/index'
import Maintain from '../src/core/screens/splash/pages/maintain'
import Category from '../src/core/screens/catalog/pages/categories/catagories'
import Home from '../src/core/screens/home/pages'
import Products from '../src/core/screens/catalog/pages/products/products'
import Settings from '../src/core/screens/settings/pages/settings'
import Sort from '../src/core/screens/catalog/pages/products/sort'
import Filter from '../src/core/screens/catalog/pages/products/filter'
import FilterSelection from '../src/core/screens/catalog/pages/products/selection'
import Drawer from '../src/core/base/components/drawer'
import Login from '../src/core/screens/customer/pages/login'
import ProductDetail from '../src/core/screens/catalog/pages/product/product'
import Cart from '../src/core/screens/checkout/pages/cart'
import Checkout from '../src/customize/checkout/pages/checkout'
import Thankyou from '../src/core/screens/checkout/pages/thankyou'
import NewAddress from '../src/core/screens/customer/pages/address'
import OrderHistory from '../src/core/screens/customer/pages/orders'
import OrderHistoryDetail from '../src/core/screens/customer/pages/order'
import MyAccount from '../src/core/screens/customer/pages/myaccount'
import AddressBook from '../src/core/screens/customer/pages/addressbook'
import WebViewPage from '../src/core/screens/webview'
import TechSpecs from '../src/core/screens/catalog/pages/product/techspecs'
import FullImage from '../src/core/screens/catalog/pages/product/fullimage'
import SearchProducts from '../src/core/screens/catalog/pages/search'
import Customer from '../src/core/screens/customer/pages/customer'
import NotificationHistory from '../src/core/screens/notification/pages'
import ForgotPassword from '../src/core/screens/customer/pages/forgotPassword'
import CreditCard from '../src/customize/checkout/pages/creditcard'
import WebAppPage from '../src/core/screens/webview/WebApp'
import CheckoutWebView from '../src/core/screens/checkout/pages/webview'
import ContactUs from '../src/plugins/contactus'
import Wishlist from '../src/plugins/wishlist'
import PaypalExpressWebView from '../src/plugins/paypalexpress/pages/webview'
import PayPalExpressAddress from '../src/plugins/paypalexpress/pages/address'
import PayPalExpressShipping from '../src/plugins/paypalexpress/pages/shipping'
import CustomPayment from '../src/plugins/custompayments/page'
import ReviewDetail from '../src/plugins/review/reviewDetail'
import ReviewPage from '../src/plugins/review/reviewPage'
import AddReview from '../src/plugins/review/addreview/addReview'


const Stack = createStackNavigator(
    {
        Splash: Splash,
Maintain: Maintain,
Category: Category,
Home: Home,
Products: Products,
Settings: Settings,
Sort: Sort,
Filter: Filter,
FilterSelection: FilterSelection,
Drawer: Drawer,
Login: Login,
ProductDetail: ProductDetail,
Cart: Cart,
Checkout: Checkout,
Thankyou: Thankyou,
NewAddress: NewAddress,
OrderHistory: OrderHistory,
OrderHistoryDetail: OrderHistoryDetail,
MyAccount: MyAccount,
AddressBook: AddressBook,
WebViewPage: WebViewPage,
TechSpecs: TechSpecs,
FullImage: FullImage,
SearchProducts: SearchProducts,
Customer: Customer,
NotificationHistory: NotificationHistory,
ForgotPassword: ForgotPassword,
CreditCard: CreditCard,
WebAppPage: WebAppPage,
CheckoutWebView: CheckoutWebView,
ContactUs: ContactUs,
Wishlist: Wishlist,
PaypalExpressWebView: PaypalExpressWebView,
PayPalExpressAddress: PayPalExpressAddress,
PayPalExpressShipping: PayPalExpressShipping,
CustomPayment: CustomPayment,
ReviewDetail: ReviewDetail,
ReviewPage: ReviewPage,
AddReview: AddReview,

    },
    {
        headerMode: 'none',
        // transitionConfig: (nav) => handleCustomTransition(nav)
    }
);

Stack.navigationOptions = ({ navigation }) => {
    let drawerLockMode = 'unlocked';
    let screenWantDisable = ['Maintain', 'WebAppPage', 'Login']; //screen want to disable drawer
    //app Astir remove comment and comment above.
    // let screenWantDisable = ['Maintain', 'WebAppPage' , 'PromotionPage']; 
    let route = navigation.state.routes;
    screenWantDisable.forEach(screen => {
        route.forEach(routeName => {
            if (routeName.routeName === screen) {
                drawerLockMode = 'locked-closed';
            }
        })
    })

    return {
        drawerLockMode,
    };
};

//app Astir remove comment.
// const handleCustomTransition = ({ scenes }) => {
//     const nextScene = scenes[scenes.length - 1];
//     if (nextScene.route.routeName == 'ProductDetail' && nextScene.route.params.swipe && nextScene.route.params.swipe == 'right') {
//         return fromLeft(500);
//     }
//     return null;
// }

// app Nejree remove comment. disable menu left all app
// Stack.navigationOptions = ({ navigation }) => {
//     drawerLockMode = 'locked-closed';

//     return {
//         drawerLockMode,
//     };
// };

const Router = createDrawerNavigator(
    {
        Splash: { screen: Splash },
        Stack: { screen: Stack }
    },
    {
        contentComponent: props => <Drawer {...props} />,
        initialRouteName: 'Splash',
        drawerPosition: I18nManager.isRTL ? 'right' : 'left',
        drawerWidth: Dimensions.get('screen').width*3/5 > 280 ? 280 : Dimensions.get('screen').width*2/3
        // For Het Gareel
        // drawerPosition: 'right'
    }
);

const App = createAppContainer(Router);

export default App;
