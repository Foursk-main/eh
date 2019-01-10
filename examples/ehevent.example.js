import { EhEvent } from '../dist/index';

//declare a class you'd like to pass as an event
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

//use the EhEvent.fromClass instantiator, and give it your class
const PersonEvent = EhEvent.fromClass(Person);

//API is similar to global eh, but without event names
//register for event through instance
PersonEvent.register(np => console.log(`${np.name} is ${np.age} years old`));

//fire event through instance
PersonEvent.fire(new Person('Dan', 100));

//Output: Dan is 100 years old