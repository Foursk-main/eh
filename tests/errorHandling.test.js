import { eh, genRandomString } from './test-kit';

describe("Error handling", function () {

    it("Promise catch", function (done) {

        const eventName = genRandomString();

        function funHandler() {
            //console.log('Fun handler');
            return;
        }

        function badHandler() {
            throw new Error('Test error');
        }

        for (let i = 0; i < 5; i++) {
            eh.register(eventName, funHandler);
        }
        eh.register(eventName, badHandler);

        eh.fire(eventName).then(() => console.log("Shouldn't get here!"))
            .catch(() => {
                console.log("Should get here! ");
                done();
            });
    });
});