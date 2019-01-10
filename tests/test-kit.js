const { EhEvent } = require('../dist/EhEvent');
const { eh } = require('../dist/EventHub');
const { expect } = require('chai');
var crypto = require('crypto');

export const genRandomString = (len = 10) => crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);

export {
    EhEvent,
    eh,
    expect
};