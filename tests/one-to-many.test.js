import { genRandomString, EhEvent, eh, expect } from './test-kit';

describe("one to many", function () {

    it("300 handlers", function (done) {

        const
            eventName = genRandomString(),
            handlerCount = 300;

        let hitCount = 0;
        const handler = () => { if (++hitCount === handlerCount) done(); }

        for (let i = 0; i < handlerCount; i++)
            eh.register(eventName, handler);

        eh.fire(eventName);
    });

    it("5 handlers, manipulate data object", function (done) {
        const
            eventName = genRandomString(),
            handlerCount = 5;

        let counter = { value: 0 };

        const handler = c => { if (++c.value === handlerCount) done(); }

        for (let i = 0; i < handlerCount; i++)
            eh.register(eventName, handler);

        eh.fire(eventName, counter);
    });
});