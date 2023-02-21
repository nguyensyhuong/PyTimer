import React from 'react';
import SimiComponent from '@base/components/SimiComponent';
import { Button, Text } from 'native-base';
import Identify from '../../../../../core/helper/Identify';
import material from '../../../../../../native-base-theme/variables/material';

export default class DeleteButton extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this)
        }
    }

    componentWillUnmount() {
        if (this.props.onRef) {
            this.props.onRef(undefined)
        }
    }

    onClickButton() {
        this.props.parent.deleteAccount();
    }


    render() {
        return (
            <Button style={{ position: 'absolute', bottom: 20, marginHorizontal: 20, width: '90%', height: 40, backgroundColor: '#E4531A', borderRadius: 20 }}
                full
                onPress={() => { this.onClickButton() }}>
                <Text style={{textTransform: 'uppercase', fontFamily: material.fontBold, fontSize: 16}}> {Identify.__('Delete Account')} </Text>
            </Button>
        );
    }
}
