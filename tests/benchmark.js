import { genRandomString, EhEvent } from './test-kit';
import { EventHub } from '../dist/EventHub';
import moment, { now } from 'moment';

const magicNumbers = [1, 100, 1000, 1000000];
//const magicNumbers = [1, 100, 1000, 10000, 100000, 1000000];
//const magicNumbers = [1, 100, 1000, 10000];
const iterations = 100;
const stats = {};

function printStats() {
    console.log();
    console.log();
    console.log('Final stats');
    for (let magnum in stats) {
        console.log('For ', +magnum);
        for (let type in stats[magnum]) {
            let sum = 0, min = 9999999, max = 0;
            let results = stats[magnum][type];
            results.forEach(r => {
                sum += r;
                if (r < min)
                    min = r;
                if (r > max)
                    max = r;
            });
            let avg = sum / results.length;
            console.log(`\t${type}: \t${avg}ms\t\tmin=${min}ms, max=${max}ms`);
        }
    }
}

function performBenchmark(magicNumber, fire, label) {
    if (!stats[magicNumber])
        stats[magicNumber] = { [label]: [] };
    if (!stats[magicNumber][label])
        stats[magicNumber][label] = [];

    return new Promise(function (resolve) {
        let start;
        let count = 0;
        const promiseRecursion = () => {
            let diff = moment().diff(start, 'milliseconds');
            stats[magicNumber][label].push(diff);

            if (++count === magicNumber) {
                resolve();
            }
            else
                fire().then(promiseRecursion);
        };

        //console.time(label);
        start = moment();
        fire().then(promiseRecursion);
    });
}

function directBenchmark(magicNumber, localEh, lastEventName) {
    //console.log(Object.keys(localEh.registrations).length);
    const obj = {};
    return performBenchmark(magicNumber, () => localEh.fire(lastEventName, obj), 'Direct');
}

function ehEventBenchmark(magicNumber, localEh) {
    class MyEvent {
        /**
         * 
         * @param {number} num 
         * @param {string} str 
         */
        constructor(num, str) {
            this.num = num;
            this.str = str;
        }
    }

    const myEvent = EhEvent.fromClass(MyEvent, 'myEvent', localEh);
    const myEventInstance = new MyEvent(1, 'Banana');

    myEvent.register(() => { return; });
    return performBenchmark(magicNumber, () => myEvent.fire(myEventInstance), 'EhEvent');
}

// function ehEventDirectBenchmark(magicNumber, localEh) {
//     class MyEvent2 {
//         /**
//          * 
//          * @param {number} num 
//          * @param {string} str 
//          */
//         constructor(num, str) {
//             this.num = num;
//             this.str = str;
//         }
//     }

//     const myEvent = EhEvent.fromClass(MyEvent2, 'myEvent2', localEh);
//     const myEventInstance = new MyEvent2(1, 'Banana');

//     myEvent.register(() => { return; });
//     return performBenchmark(magicNumber, () => localEh.fire('myEvent2', myEventInstance), 'Ehv+Dir');
// }

/**
 * 
 * @param {[string]} names 
 */
async function benchmarkWithNamesArray(magicNumber, names) {
    const localEh = new EventHub;
    let lastEventName = '';
    //const labelRegistration = `Registr`;

    //console.time(labelRegistration);
    for (let i = 0; i < magicNumber; i++) {
        localEh.register(lastEventName = names[i], () => { return; });
    }
    //console.timeEnd(labelRegistration);
    console.log("localEh events: ", Object.keys(localEh.registrations).length);

    for (let i = 0; i < iterations; i++) {
        await directBenchmark(magicNumber, localEh, lastEventName);
        await ehEventBenchmark(magicNumber, localEh);
        //await ehEventDirectBenchmark(magicNumber, localEh);
    }

}

console.log("******************* Benchmarks *******************")

const maxMagicNumber = magicNumbers[magicNumbers.length - 1];
const names = [];
console.log(`Generating ${maxMagicNumber} names`);
console.time('Generate Names');
for (let i = 0; i < maxMagicNumber; i++) {
    names.push(genRandomString(20));
}
console.timeEnd('Generate Names');
console.log();

function runBenchmark(idx) {
    if (idx === magicNumbers.length) {
        printStats();
        console.log("Done.");
        return;
    }

    let magicNumber = magicNumbers[idx];
    console.log(`Benchmark ${magicNumber}`);
    benchmarkWithNamesArray(magicNumber, names).then(() => {
        console.log(`done.`);
        console.log();
        runBenchmark(idx + 1);
    });
}

runBenchmark(0);