import { EhEvent } from '../dist/index';

// declare a class you'd like to pass as an event
class Person {
    /**
     * 
     * @param {string} name 
     * @param {number} age 
     */
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

// use the EhEvent.fromClass instantiator, and give it your class
const personEvent = EhEvent.fromClass(Person);

// API is similar to global eh, but without event names
// register for event through instance
personEvent.register(np => console.log(`${np.name} is ${np.age} years old`));

// fire event through instance
personEvent.fire(new Person('Dan', 100));

// Output: Dan is 100 years old

// use the EhEvent.fromInstance instantiator, with a template instance. 
// use redundant data of desired type to inform intellisense
const imaginaryConcertEvent = EhEvent.fromInstance({ artist: '' });

imaginaryConcertEvent.register(({ artist }) => console.log(`${artist} is performing tonight!`));

imaginaryConcertEvent.fire(({ artist: 'John Lennon' }));

// Output: John Lennon is performing tonight!