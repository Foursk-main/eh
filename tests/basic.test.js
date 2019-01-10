import { genRandomString, eh, expect } from './test-kit';

/**
 * tests
 * - basic test - register, fire and receive
 * - basic test - register, fire with integer and receive
 * - basic test - register, fire with string and receive
 * - basic test - register, fire with object and receive
 *
 * - one to many - multiple handlers for one event
 * 
 * - many to one - make sure all fired events are received
 * 
 * - promise - aggregation
 * - promise - chaining
 * 
 * - EhEvent - create event from object
 * - EhEvent - create event from class
 * - EhEvent - create event from instance
 */

describe("basic tests", function () {
    const eventName = genRandomString();

    it('event without data', function (done) {
        eh.register(eventName, done);
        eh.fire(eventName);
    });

    it('event with integer data', function (done) {
        const eventName = genRandomString();
        const data = 5;

        eh.register(eventName, function (int) {
            expect(int).to.be.equal(data, "Received data does not match fired data");
            done();
        });

        eh.fire(eventName, data);
    });

    it('event with string data', function (done) {
        const eventName = genRandomString();
        const data = "banana";

        eh.register(eventName, function (str) {
            expect(str).to.be.equal(data, "Received data does not match fired data");
            done();
        });

        eh.fire(eventName, data);
    });

    it('event with object data', function (done) {
        const eventName = genRandomString();
        const data = { num: 4, str: "hello" };

        eh.register(eventName, function (str) {
            expect(str).to.be.equal(data, "Received data does not match fired data");
            done();
        });

        eh.fire(eventName, data);
    });
});
