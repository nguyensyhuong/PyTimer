import React from 'react';
import { Form } from 'native-base';

export default class SimiForm extends React.Component {

    constructor(props) {
        super(props);
        this.object = {};
        this.validateStatus = {};
        this.formSize = 0;
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

    updateFormData(key, value, validated) {
        this.object[key] = value;
        this.validateStatus[key] = validated
        this.checkButtonStatus();
    }

    checkButtonStatus() {
        let buttonStatus = true;
        if (Object.keys(this.validateStatus).length < this.formSize) {
            buttonStatus = false;
        } else {
            for (let key in this.validateStatus) {
                let status = this.validateStatus[key];
                if (status === false) {
                    buttonStatus = false;
                    break;
                }
            }
        }
        this.props.parent.updateButtonStatus(buttonStatus);
    }

    initFields() {
        let newFields = [];
        let fields = this.props.fields;
        this.formSize = fields.length;
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if(Object.keys(this.validateStatus).length < this.formSize) {
                let validated = false;
                if(!field.props.required || (field.props.required && field.props.inputValue)) {
                    validated = true;
                }
                this.validateStatus[field.props.inputKey] = validated;
            }
            newFields.push(React.cloneElement(field, { parent: this }));
        }
        return newFields;
    }

    render() {
        if(Object.keys(this.object).length == 0) {
            this.object = this.props.initData ? this.props.initData : {};
        }
        return (
            <Form>
                {this.initFields()}
            </Form>
        );
    }

    getFormData() {
        return this.object;
    }

    setFormData(data) {
        this.object = data;
    }
}