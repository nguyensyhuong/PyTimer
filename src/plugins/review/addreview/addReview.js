import React from 'react';
import SimiPageComponent from "@base/components/SimiPageComponent";
import { Text, Content, Container, View, Input, Button, Textarea, Toast, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import Identify from "@helper/Identify";
import NewConnection from '@base/network/NewConnection'
import NavigationManager from "@helper/NavigationManager";
import { review_product } from "../../constants";
import StarContainer from './component/StarsContainer';
import material from '@theme/variables/material';

const styles = StyleSheet.create({
    oneRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '80%',
        marginTop: 10
    },
    itemFlex: {
        // flexGrow: 1
    },
    input: {
        borderColor: '#c9c9c9',
        borderWidth: 0.4,
        marginTop: 10,
        marginBottom: 18
    }
})
class addReview extends SimiPageComponent {
    constructor(props) {
        super(props);
        this.isBack = true;
        this.title = Identify.__('Add Review')
        this.productId = this.props.navigation.getParam('productId');
        this.rateForm = this.props.navigation.getParam('rateForm');
        this.state = {
            ...this.state,
            ratings: {},
            nickName: '',
            title: '',
            detail: ''
        }
    }

    setData(data, requestID) {
        this.showLoading('none');
        if (data.errors) {
            let errors = data.errors;
            let text = "";
            for (let i in errors) {
                let error = errors[i];
                text += error.message + ' ';
            }
            if (text !== "") {
                Toast.show({ text: text, textStyle: { fontFamily: material.fontFamily }, duration: 3000, type: "warning" });
            }
        } else {
            Toast.show({ text: data.message, textStyle: { fontFamily: material.fontFamily }, duration: 3000 });
            NavigationManager.backToPreviousPage(this.props.navigation)
        }
    }

    renderRateSection() {
        let rateSection = this.rateForm.rates.map((item, index) => {
            return (
                <View key={index} style={styles.oneRow}>
                    <Text style={styles.itemFlex}>{Identify.__(item.rate_code)}</Text>
                    <StarContainer data={item.rate_options} parent={this} />
                </View>
            )
        })
        return (
            <View>
                {rateSection}
            </View>
        )
    }

    handleTextChange(text, key) {
        this.state[key] = text;
    }

    handleSubmitReview = () => {
        const nickname = this.state.nickName;
        const title = this.state.title;
        const detail = this.state.detail;
        if (nickname === "" || title === "" || detail === "") {
            Toast.show({ text: Identify.__('Please fill in all required fields'), textStyle: { fontFamily: material.fontFamily }, duration: 3000 });
        } else {
            let params = {
                product_id: this.productId,
                ratings: this.state.ratings,
                nickname,
                title,
                detail
            };
            this.showLoading('dialog');
            new NewConnection()
                .init(review_product, 'submit_review', this, 'POST')
                .addBodyData(params)
                .connect();
        }
    };
    renderInputLayout(tit, placeholder, key, textArea = false) {
        let textAreaInput = <Textarea
            style={{ ...styles.input, fontFamily: material.fontFamily }}
            rowSpan={5}
            placeholder={Identify.__('Enter detail')}
            onChangeText={(txt) => { this.handleTextChange(txt, key) }}
        />
        let normalInput = <Input
            style={{ ...styles.input, fontFamily: material.fontFamily }}
            placeholder={placeholder}
            onChangeText={(txt) => { this.handleTextChange(txt, key) }}
        />
        return (
            <View>
                <Text>{tit}</Text>
                {textArea ? textAreaInput : normalInput}
            </View>
        )
    }
    renderInputFrom() {
        return (
            <View style={{ marginTop: 20 }}>
                {this.renderInputLayout(Identify.__('Nickname (*)'), Identify.__('Enter Nickname'), 'nickName')}
                {this.renderInputLayout(Identify.__('Title (*)'), Identify.__('Enter title'), 'title')}
                {this.renderInputLayout(Identify.__('Detail (*)'), Identify.__('Enter detail'), 'detail', true)}
                <Button style={{ width: '100%', justifyContent: 'center' }} title={Identify.__('Submit Review')} onPress={() => this.handleSubmitReview()}>
                    <Text>{Identify.__('Submit Review')}</Text>
                </Button>
            </View>
        )
    }

    createLayout() {
        return (
            <Container>
                <Content style={[{ padding: 12 }, Identify.isRtl() ? { marginLeft: 12 } : {}]}>
                    <View style={{ paddingBottom: 30 }}>
                        <Text style={{ marginBottom: 12 }}>{Identify.__('HOW DO YOU RATE THIS PRODUCT?')}</Text>
                        {this.renderRateSection()}
                        {this.renderInputFrom()}
                    </View>
                </Content>
            </Container>
        )
    }
}
export default addReview;