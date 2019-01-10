import { genRandomString, EhEvent, eh, expect } from './test-kit';

describe("many to one", function () {

    it("300 handlers", function (done) {
        const handlerCount = 300,
            eventNames = [];

        let hitCount = 0;
        const handler = () => { if (++hitCount === handlerCount) done(); }

        for (let i = 0; i < handlerCount; i++) {
            let eventName = genRandomString();
            eventNames.push(eventName);
            eh.register(eventName, handler);
        }

        for (let i in eventNames)
            eh.fire(eventNames[i]);
    });

    it("5 handlers, manipulate data object", function (done) {
        const
            handlerCount = 5,
            eventNames = [];

        let counter = { value: 0 };

        const handler = c => { if (++c.value === handlerCount) done(); }

        for (let i = 0; i < handlerCount; i++) {
            let eventName = genRandomString();
            eventNames.push(eventName);
            eh.register(eventName, handler);
        }

        for (let i in eventNames)
            eh.fire(eventNames[i], counter);
    });
});