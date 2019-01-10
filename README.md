# eh - simple & tiny event manager

Eh provides simple and flexible event management.

## Installation
    npm i -s @foursk/eh

## Examples

Basic usage
```javascript
//declare an event name
const MY_EVENT = 'myEvent';

//create a handler for your event
function myEventHandler(data, eventName) {
    console.log(`${eventName} ${data}`);
}

//register you handler with the relevant event name
eh.register(MY_EVENT, myEventHandler);

//fire/raise your event, with relevant data
eh.fire(MY_EVENT, 3);

//Output: myEvent 3
```

Using event instance (EhEvent)
```javascript
//declare a class you'd like to pass as an event
class Person {
    /**
     * JDoc used for intellisense
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
```

EhEvent usage comes with pretty comfortable intellisense support

![alt text](https://github.com/Foursk-main/eh/raw/master/examples/snips/ehEventIntellisense.png "Intellisense support")

## Yet to be documented
- Promises
- EhEvent from instance
- Error handling
- Many to one/One to many
- Event chains
- Demo