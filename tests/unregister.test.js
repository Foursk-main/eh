import { genRandomString, expect } from './test-kit';
import eh, { EhEvent } from '../dist';

describe("unregister", function () {

    it("eh - unregister API", async function () {
        const eventName = genRandomString();
        let manipulateMe = 0;

        const handler1 = () => manipulateMe++;
        const handler2 = () => manipulateMe--;

        eh.register(eventName, handler1);
        eh.register(eventName, handler2);

        await eh.fire(eventName);

        expect(manipulateMe).to.be.equal(0);

        eh.unregister(eventName, handler2);

        await eh.fire(eventName);

        expect(manipulateMe).to.be.equal(1);
    });

    it("eh - unregister with returned unregister()", async function () {
        const eventName = genRandomString();
        let manipulateMe = 0;

        const handler1 = () => manipulateMe++;
        const handler2 = () => manipulateMe--;

        eh.register(eventName, handler1);
        const unregisterHandler2 = eh.register(eventName, handler2).unregister;

        await eh.fire(eventName);

        expect(manipulateMe).to.be.equal(0);

        unregisterHandler2();

        await eh.fire(eventName);

        expect(manipulateMe).to.be.equal(1);
    });

    it("Eh Event - unregister API", async function () {

        class UnregisterTest {
            constructor() {
                this.manipulateMe = 0;
            }
        }
        const event = EhEvent.fromClass(UnregisterTest);

        const handler1 = ut => ut.manipulateMe++;
        const handler2 = ut => ut.manipulateMe--;

        event.register(handler1);
        event.register(handler2);

        const ut = new UnregisterTest;
        await event.fire(ut);

        expect(ut.manipulateMe).to.be.equal(0);

        event.unregister(handler2);

        await event.fire(ut);

        expect(ut.manipulateMe).to.be.equal(1);
    });

    it("Eh Event - unregister with returned unregister()", async function () {

        class UnregisterTest {
            constructor() {
                this.manipulateMe = 0;
            }
        }
        const event = EhEvent.fromClass(UnregisterTest);

        const handler1 = ut => ut.manipulateMe++;
        const handler2 = ut => ut.manipulateMe--;

        event.register(handler1);
        const { unregister } = event.register(handler2);

        const ut = new UnregisterTest;
        await event.fire(ut);

        expect(ut.manipulateMe).to.be.equal(0);

        unregister();

        await event.fire(ut);

        expect(ut.manipulateMe).to.be.equal(1);
    });
});