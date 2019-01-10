import { genRandomString, EhEvent, eh, expect } from './test-kit';

function getPromiseTest(handler) {
    return function (done) {
        const
            eventName = genRandomString(),
            handlerCount = 300;

        let counter = { value: 0 };
        //const handler = async c => ++c.value;
        //const handler = c => new Promise(resolve => { c.value++; resolve(c); });

        for (let i = 0; i < handlerCount; i++) {
            eh.register(eventName, handler);
        }

        eh.fire(eventName, counter).then(c => {
            expect(c.value).to.be.equal(handlerCount);
            done();
        });
    };
}

describe("promises", function () {

    it("aggregation classic promise",
        getPromiseTest(c => new Promise(resolve => { c.value++; resolve(c); }))
    );

    it("aggregation async await",
        getPromiseTest(async c => ++c.value)
    );

    it("aggregation, handler doesn't return promise",
        getPromiseTest(c => c.value++)
    );

    it("chaining", async function () {

        const
            event1 = genRandomString(),
            event2 = genRandomString(),
            event3 = genRandomString();

        const handler3 = () => console.log('promise chaining handler3');
        const handler2 = async () => { console.log('promise chaining handler2'); return eh.fire(event3); };
        const handler1 = async () => { console.log('promise chaining handler1'); return eh.fire(event2); };

        eh.register(event3, handler3);
        eh.register(event2, handler2);
        eh.register(event1, handler1);

        await eh.fire(event1);
    });
});