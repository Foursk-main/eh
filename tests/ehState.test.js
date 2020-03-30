import { EhState, expect } from './test-kit';

describe("EhState", function () {

    const sLanguageTemplate = { language: 'en', phase: 0 };

    it("Initial State", function (done) {
        const sLanguage = EhState.fromInitialState(sLanguageTemplate);
        const { unregister } = sLanguage.register(langState => {
            const { language } = langState;
            expect(language).to.be.equal('en');
        });
        unregister();
        done();
    });

    it("Mutation", async function () {
        const sLanguage = EhState.fromInitialState(sLanguageTemplate);
        const { unregister } = sLanguage.register(langState => {
            const { test, language, phase } = langState;
            if (phase === 1) {
                expect(test).to.be.equal(true);
                expect(language).to.be.equal('en');
            }
        });

        await sLanguage.fire({ phase: 1, test: true });
        unregister();
    });

    it("Modification", async function () {
        const sLanguage = EhState.fromInitialState(sLanguageTemplate);
        const { unregister } = sLanguage.register(langState => {
            const { language, phase } = langState;
            if (phase === 2) {
                expect(language).to.be.equal('he');
            }
        });

        await sLanguage.fire({ language: 'he', phase: 2 });
        unregister();
    });

    it("Registration After Modification", async function () {
        const sLanguage = EhState.fromInitialState(sLanguageTemplate);
        const { unregister: unregister1 } = sLanguage.register(() => { });

        await sLanguage.fire({ phase: 3, language: 'he' });

        const { unregister: unregister2 } = sLanguage.register(langState => {
            const { language, phase } = langState;
            if (phase === 3) {
                expect(language).to.be.equal('he');
            }
        });

        unregister1();
        unregister2();
    });
});