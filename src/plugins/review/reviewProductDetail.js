import React from 'react';
import SimiComponent from "@base/components/SimiComponent";
import { Card, CardItem, View, Text, Button, Icon, H3 } from 'native-base';
import { FlatList, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import Identify from "@helper/Identify";
import ReviewItem from './reviewItem';
import NewConnection from '@base/network/NewConnection'
import NavigationManager from '@helper/NavigationManager';
import { connect } from 'react-redux';

class Review extends SimiComponent {
    constructor(props) {
        super(props);
        this.data = this.props.product;
        this.state = {
            data: null,
            starCount: this.data.app_reviews ? this.data.app_reviews.rate : 0
        };
    }

    requestGetReview() {
        new NewConnection()
            .init('simiconnector/rest/v2/reviews?filter[product_id]=' + this.props.product.entity_id, 'get_reviews', this)
            .connect();
    }

    setData(data) {
        this.setState({ data: data });
    }

    buttonOnPress(type, item) {
        let params = {};
        let route = '';
        if (type === 3) {
            params = {
                itemData: item
            }
            route = 'ReviewDetail';
            NavigationManager.openPage(this.props.navigation, route, params);
        } else if (this.props.product.app_reviews && this.props.product.app_reviews.form_add_reviews) {
            switch (type) {
                case 1:
                    params = {
                        productId: this.props.product.entity_id,
                        reviewPageData: this.state.data,
                        productName: this.props.product.name,
                        ratePoint: this.data.app_reviews.rate,
                        rateForm: this.props.product.app_reviews.form_add_reviews[0],
                        isLogin: Identify.isEmpty(this.props.customer_data)
                    }
                    route = 'ReviewPage'
                    break;
                case 2:
                    params = {
                        productId: this.props.product.entity_id,
                        rateForm: this.props.product.app_reviews.form_add_reviews[0]
                    }
                    route = 'AddReview'
                    break;
                default:
                    break;
            }
            NavigationManager.openPage(this.props.navigation, route, params);
        }
    }
    renderSomeReviewItem(item) {
        return (
            <TouchableOpacity
                style={{ width: '100%', marginBottom: 15 }}
                onPress={() => { this.buttonOnPress(3, item) }}
            >
                <View icon
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <ReviewItem fromDetail={true} item={item} navigation={this.props.navigation} />
                    <Icon name={Identify.isRtl() ? 'ios-arrow-back' : "ios-arrow-forward"} />
                </View>
            </TouchableOpacity>
        )
    }
    renderSomeReview() {
        if (this.state.data) {
            if (this.state.data.reviews.length > 0) {
                if (this.state.data.reviews.length < 3) {
                    button = <Button
                        style={{ width: '100%', justifyContent: 'center' }}
                        icon
                        disabled={Identify.isEmpty(this.props.customer_data)}
                        onPress={() => {
                            this.buttonOnPress(2)
                        }}
                    >
                        <Text>{Identify.isEmpty(this.props.customer_data) ? Identify.__('Only user can add review') : Identify.__('Add Review')}</Text>
                    </Button>
                } else {
                    button = <Button
                        style={{ width: '100%', justifyContent: 'center' }}
                        icon
                        onPress={() => {
                            this.buttonOnPress(1)
                        }}
                    >
                        <Text>{Identify.__('View all')}</Text>
                    </Button>
                }
            } else {
                if (Identify.isEmpty(this.props.customer_data)) {
                    button = <Button
                        style={{ width: '100%', justifyContent: 'center' }}
                        icon
                        disabled={true}
                    >
                        <Text>{Identify.__('Only user can add review')}</Text>
                    </Button>;
                } else {
                    button = <Button
                        style={{ width: '100%', justifyContent: 'center' }}
                        icon
                        onPress={() => {
                            this.buttonOnPress(2)
                        }}
                    >
                        <Text>{Identify.__('Be the first to review this product')}</Text>
                    </Button>;
                }
            }
            return (
                <View>
                    <CardItem>
                        <FlatList
                            data={this.state.data.reviews.slice(0, 3)}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item.review_id}
                            renderItem={({ item }) =>
                                this.renderSomeReviewItem(item)
                            }
                        />
                    </CardItem>
                    <CardItem>
                        {button}
                    </CardItem>
                </View>
            )
        }
    }

    getTotalReviews = () => {
        if (this.state.data) {
            return this.state.data.total;
        } else {
            return this.data.app_reviews.reviews_count;
        }
    }

    calculateRating = () => {
        if (this.state.data?.total > 0) {
            if (this.state.data) {
                const { count, total } = this.state.data;
                return ((count['1_star'] + count['2_star'] * 2 + count['3_star'] * 3 + count['4_star'] * 4 + count['5_star'] * 5) / total).toFixed(2);
            } else {
                return this.data.app_reviews.rate.toFixed(2);
            }
        } else {
            return 0;
        }

    }

    renderPhoneLayout() {
        if (this.props.parent.state.reRender && !this.state.data) {
            this.requestGetReview();
        }
        if (this.data.hasOwnProperty('app_reviews') && (this.data.app_reviews.length > 0 || !Identify.isEmpty(this.data.app_reviews))) {
            return (
                <Card style={{ marginLeft: 10, marginRight: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 0.3, borderBottomColor: '#c9c9c9', padding: 10 }}>
                        <H3 style={{ flex: 1, textAlign: 'left' }}>{Identify.__('Review')} ({this.getTotalReviews()})</H3>
                        {this.data.app_reviews.rate != null && <Text style={{ flexGrow: 1, textAlign: 'right' }}>({this.calculateRating()})</Text>}
                        <StarRating
                            maxStars={5}
                            rating={this.state.starCount}
                            starSize={17}
                            containerStyle={{ marginTop: 3, marginStart: 10 }}
                            fullStarColor='#ffcc00'
                            emptyStarColor='#ffcc00'
                        />
                    </View>
                    {this.renderSomeReview()}
                </Card>
            )
        }
    }
}
const mapStateToProps = (state) => {
    return {
        customer_data: state.redux_data.customer_data,
    };
}

export default connect(mapStateToProps)(Review);