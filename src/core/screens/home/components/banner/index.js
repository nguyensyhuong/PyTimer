import React from 'react';
import { connect } from 'react-redux';
import { View, Image, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { StackActions } from 'react-navigation';
import NavigationManager from '../../../../helper/NavigationManager';
import styles from './styles';
import Events from '@helper/config/events';

class Banner extends React.Component {

    onSelectBanner(banner) {
        let data = {};
        data['event'] = 'home_action';
        data['action'] = 'selected_banner';
        data['banner_title'] = banner.banner_title;
        data['banner_id'] = banner.banner_id;
        let type = banner.type;
        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: banner.product_id,
                };
                data['banner_type'] = 'product';
                data['product_id'] = banner.product_id;
                break;
            case '2':
                if (banner.has_children) {
                    routeName = 'Category';
                    params = {
                        categoryId: banner.category_id,
                        categoryName: banner.cat_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: banner.category_id,
                        categoryName: banner.cat_name,
                    };
                }
                data['banner_type'] = 'category';
                data['category_id'] = banner.category_id;
                break;
            case '3':
                routeName = 'WebViewPage';
                params = {
                    uri: banner.banner_url,
                };
                data['banner_type'] = 'web';
                break;
            default:
                break;
        }
        Events.dispatchEventAction(data, this);
        NavigationManager.openRootPage(this.props.navigation, routeName, params);
    }
    renderBanner(banner) {
        return (
            <TouchableOpacity key={banner.banner_id} onPress={() => {
                this.onSelectBanner(banner);
            }}>
                <View>
                    <Image source={{ uri: banner.banner_name }} style={styles.banner} />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let banners = [];
        for (let i in this.props.data) {
            let banner = this.props.data[i];
            banners.push(
                this.renderBanner(banner)
            );
        }
        return (
            <View style={styles.banner}>
                <Swiper height={200} horizontal={true} autoplay autoplayTimeout={5}>
                    {banners}
                </Swiper>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return { data: state.redux_data.home_data.home.homebanners.homebanners };
}
export default connect(mapStateToProps)(Banner);
