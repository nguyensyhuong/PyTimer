import React from 'react'
import StarRating from 'react-native-star-rating';

export default class reviewStar extends React.Component {
    constructor(props){
        super(props)
        this.parent = this.props.parent
    }
    onStarRating(){
        this.parent.parent.state.ratings[this.props.keyStar] = this.props.value;
        this.parent.setState({index: this.props.position})
    }
    render(){
        return <StarRating
            maxStars={1}
            rating={this.props.rate}
            starSize={20}
            containerStyle={{marginTop: 3, marginStart: 10}}
            fullStarColor='#ffcc00'
            emptyStarColor='#ffcc00'
            selectedStar={() => this.onStarRating()}
        />
    }
}