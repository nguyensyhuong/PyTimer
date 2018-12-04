import React from 'react';
import { View, Text, H3, Button } from 'native-base';
import { Modal, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import NavigationManager from '../../../helper/NavigationManager';

class Notification extends React.Component {

    constructor(props) {
        super(props);
    }

    openNotification(notification) {
        let type = notification.type;
        switch (type) {
            case '1':
                routeName = 'ProductDetail';
                params = {
                    productId: notification.productID ? notification.productID : notification.product_id,
                };
                break;
            case '2':
                if (notification.has_child) {
                    routeName = 'Category';
                    params = {
                        categoryId: notification.categoryID ? notification.categoryID : notification.category_id,
                        categoryName: notification.categoryName ? notification.categoryName : notification.category_name,
                    };
                } else {
                    routeName = 'Products';
                    params = {
                        categoryId: notification.categoryID ? notification.categoryID : notification.category_id,
                        categoryName: notification.categoryName ? notification.categoryName : notification.category_name,
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
        NavigationManager.openRootPage(null, routeName, params);
    }
    renderNotificationPopupLayout(title, imageUrl, content, noti){
        return (
            <Modal onRequestClose={() => null} visible={true} transparent={true} animationType="fade">
                <View style={styles.container}>
                    <View style={styles.dialog}>
                        <H3>{title}</H3>
                        {imageUrl != '' && <Image resizeMode='center' source={{ uri: imageUrl }} style={styles.image} />}
                        <Text numberOfLines={3} style={styles.message}>{content}</Text>
                        <View style={styles.buttonContainer}>
                            <Button transparent style={styles.button} onPress={() => {
                                this.props.storeData({
                                    show: false,
                                    data: {}
                                });
                            }}>
                                <Text style={{textAlign: 'center', width: '100%'}}>Cancel</Text>
                            </Button>
                            <Button transparent style={styles.button} onPress={() => {
                                this.props.storeData({
                                    show: false,
                                    data: {}
                                });
                                this.openNotification(noti);
                            }}>
                                <Text style={{textAlign: 'center', width: '100%'}}>Show</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    renderNotificationPopup() {
        let noti = this.props.data.data;
        let title = noti.title ? noti.title : noti.notice_title;
        let imageUrl = noti.imageUrl ? noti.imageUrl : decodeURI(noti.image_url);
        let content = noti.message ? noti.message : noti.notice_content;

        return this.renderNotificationPopupLayout(title, imageUrl, content, noti)
    }

    render() {
        if (this.props.data.show == true) {
            return (
                <View>
                    {this.renderNotificationPopup()}
                </View>
            );
        } else {
            return (
                <View />
            );
        }
    }
}

const mapStateToProps = state => ({
    data: state.redux_data.showNotification
});

const mapDispatchToProps = (dispatch) => {
    return {
        storeData: (data) => {
            dispatch({ type: 'showNotification', data: data })
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
