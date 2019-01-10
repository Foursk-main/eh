import eh, { EhEvent, EventHub } from '../dist/index';
import { expect } from 'chai';
import crypto from 'crypto';

export const genRandomString = (len = 10) => crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);

export {
    EhEvent,
    EventHub,
    eh,
    expect
};