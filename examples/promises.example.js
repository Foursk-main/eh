// const { EhEvent } = require('../dist');
import { EhEvent } from '../dist';

const eCalculate = EhEvent.fromInstance({ someNumber: 0 });

// create a calculator using the "leisure function" createHandler
const powCalculator = eCalculate.createHandler(data => {
    data.someNumber *= data.someNumber;
});

// register your calculator
eCalculate.register(powCalculator);

// fire returns a promise containing the final object
eCalculate.fire({ someNumber: 5 })
    .then(console.log); //output: { someNumber: 25 }

// this syntax works with async/await as well
async function cannon() {
    const { someNumber } = await eCalculate.fire({ someNumber: 6 });
    console.log('someNumber', someNumber); //output: someNumber 36
}
cannon();

// relevant for mutations or enrichments as well
const eEnrich = EhEvent.fromInstance({});

// enrichment 1
eEnrich.register(data => {
    data.now = new Date;
});

// enrichment 2
eEnrich.register(data => {
    data.weather = 'sunny';
});

// promise will resolved with enriched object
eEnrich.fire({}).then(console.log); //output: { now: 2020-02-22T18:59:45.693Z, weather: 'sunny' }