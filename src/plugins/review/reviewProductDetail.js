import React from 'react';
import SimiComponent from "../../core/base/components/SimiComponent";
import {Card, CardItem, View, Text, Button, Icon} from 'native-base';
import {FlatList, TouchableOpacity} from 'react-native';
import StarRating from 'react-native-star-rating';
import Identify from "../../core/helper/Identify";
import ReviewItem from './reviewItem';
import Connection from '../../core/base/network/Connection'
import NavigationManager from '../../core/helper/NavigationManager';
import { connect } from 'react-redux';

class Review extends SimiComponent{
    constructor(props){
        super(props);
        this.data = this.props.product;
        this.state = {
            data : null,
            starCount: this.data.app_reviews ? this.data.app_reviews.rate : 0
        };
    }

    componentDidMount(){
        if(!this.state.data){
            Connection.restData();
            Connection.connect('simiconnector/rest/v2/reviews?filter[product_id]=' + this.props.product.entity_id, this, 'GET')
        }
    }

    setData(data){
        this.setState({data: data});
    }
    buttonOnPress(type, item){
        let params = {};
        let route = '';
        switch (type){
            case 1:
                params = {
                    productId : this.props.product.entity_id,
                    reviewPageData : this.state.data,
                    productName: this.props.product.name,
                    ratePoint : this.data.app_reviews.rate,
                    rateForm : this.props.product.app_reviews.form_add_reviews[0],
                    isLogin : Identify.isEmpty(this.props.customer_data)
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
            case 3:
                params = {
                    itemData : item
                }
                route = 'ReviewDetail'
                break;
            default:
                break;
        }
        NavigationManager.openPage(this.props.navigation, route, params)
    }
    renderSomeReviewItem(item){
        return (
            <TouchableOpacity
                style={{width: '100%', marginBottom: 15}}
                onPress={() => {this.buttonOnPress(3, item)}}
            >
                <View icon
                      style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                      }}
                >
                    <ReviewItem item={item} navigation={this.props.navigation} />
                    <Icon name='ios-arrow-forward-outline'/>
                </View>
            </TouchableOpacity>
        )
    }
    renderSomeReview(){
        if(this.state.data){
            if(this.state.data.reviews.length > 0){
                if(this.state.data.reviews.length < 3){
                    button = <Button
                        style={{width: '100%', justifyContent: 'center'}}
                        icon
                        disabled={Identify.isEmpty(this.props.customer_data)}
                        onPress={()=> {
                            this.buttonOnPress(2)
                        }}
                    >
                        <Text>{Identify.isEmpty(this.props.customer_data) ? Identify.__('Only user can add review') : Identify.__('Add Review')}</Text>
                    </Button>
                } else {
                    button = <Button
                        style={{width: '100%', justifyContent: 'center'}}
                        icon
                        onPress={()=> {
                            this.buttonOnPress(1)
                        }}
                    >
                        <Text>{Identify.__('View all')}</Text>
                    </Button>
                }
            } else {
                if(Identify.isEmpty(this.props.customer_data)){
                    button = <Button
                        style={{width: '100%', justifyContent: 'center'}}
                        icon
                        disabled={true}
                    >
                        <Text>{Identify.__('Only user can add review')}</Text>
                    </Button>;
                } else {
                    button = <Button
                        style={{width: '100%', justifyContent: 'center'}}
                        icon
                        onPress={()=> {
                            this.buttonOnPress(2)
                        }}
                    >
                        <Text>{Identify.__('Be the first to review this product')}</Text>
                    </Button>;
                }
            }
            return(
                <View>
                    <CardItem>
                        <FlatList
                            data={this.state.data.reviews.slice(0,3)}
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

    renderPhoneLayout(){
        if(this.data.hasOwnProperty('app_reviews')){
            return(
                <Card style={{marginLeft: 12, marginRight: 12}}>
                    <CardItem>
                        <View style={{flex: 1, flexDirection: 'row', borderBottomWidth: 0.3, borderBottomColor: '#c9c9c9', paddingBottom: 10}}>
                            <Text style={{fontSize: 16, fontWeight: '700'}}>Review ({this.data.app_reviews.number})</Text>
                            <Text style={{flexGrow: 1, textAlign: 'right'}}>({this.data.app_reviews.rate.toFixed(2)})</Text>
                            <StarRating
                                maxStars={5}
                                rating={this.state.starCount}
                                starSize={17}
                                containerStyle={{marginTop: 3, marginStart: 10}}
                                fullStarColor='#ffcc00'
                                emptyStarColor='#ffcc00'
                            />
                        </View>
                    </CardItem>
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