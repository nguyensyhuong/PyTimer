import React from 'react';
import Identify from '@helper/Identify';
import simicart from '@helper/simicart';
import md5 from 'md5';

const maxLength = 14;
const minLength = 4;
const template = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const Buffer = require("buffer").Buffer;

export default function createURL(quoteId) {

    function randomNumber(max, min) {
        return Math.round(min + Math.random() * (max - min));
    }

    let email = '';
    let password = '';
    quoteId = new Buffer(quoteId).toString("base64");
    let secretKey = md5(simicart.merchant_authorization);

    let customerParams = Identify.getCustomerParams();
    if (customerParams) {
        email = customerParams.email;
        password = customerParams.password;
    }

    let salt = '';
    let randLength = randomNumber(maxLength, minLength);
    for (let i = 0; i < randLength; i++) {
        salt += template.charAt(randomNumber(template.length, 0));
    }

    let token = '';
    let customerData = {
        email: email,
        password: password,
        quote_id: quoteId,
    };

    let encodedCustomerData = new Buffer(JSON.stringify(customerData)).toString("base64");

    secretKey = secretKey.slice(0, salt.length) + salt + secretKey.slice(salt.length, secretKey.length);
    token = encodedCustomerData.slice(0, salt.length) + secretKey + encodedCustomerData.slice(salt.length, encodedCustomerData.length);
    token = new Buffer(token).toString("base64");

    let url = simicart.merchant_url + '/simipaypalexpress/redirect/?token=' + token + '&salt=' + salt;
    return url;
}