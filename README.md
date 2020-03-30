# eh - simple event manager

Eh provides simple and flexible event management.

For any questions, comments, feedback or hi-saying feel free to hit me up:
orangilboa@gmail.com

v 1.0.0 added simple state management

v 0.1.5: updated packages

## Installation
    npm i -s @foursk/eh

## Examples

### Basic
```javascript
// declare an event name
const MY_EVENT = 'myEvent';

// create a handler for your event
function myEventHandler(data, eventName) {
    console.log(`${eventName} ${data}`);
}

// register you handler with the relevant event name
eh.register(MY_EVENT, myEventHandler);

// fire/raise your event, with relevant data
eh.fire(MY_EVENT, 3);

// Output: myEvent 3
```

### Event instances
Using EhEvent, you can create typed event instances using classes or object instances.

Using a class:
```javascript
// declare a class you'd like to pass as an event
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

// use the EhEvent.fromClass instantiator, and pass it your class
const PersonEvent = EhEvent.fromClass(Person);

// API is similar to global eh, but without event names
// register for event through instance
PersonEvent.register(np => console.log(`${np.name} is ${np.age} years old`));

// fire event through instance
PersonEvent.fire(new Person('Dan', 100));

// Output: Dan is 100 years old

```
Using an object instance:
```javascript

// use the EhEvent.fromInstance instantiator, with a template instance. 
// use redundant data of desired type to "inform" intellisense
const imaginaryConcertEvent = EhEvent.fromInstance({ artist: '' });

imaginaryConcertEvent.register(({ artist }) => console.log(`${artist} is performing tonight!`));

imaginaryConcertEvent.fire(({ artist: 'Paul McCartney' }));

// Output: Paul McCartney is performing tonight!
```

EhEvent usage comes with pretty comfortable intellisense support

![alt text](https://github.com/Foursk-main/eh/raw/master/examples/snips/ehEventIntellisense.png "Intellisense support")

### Promises
A fired eh event returns a promise, that resolves after all handlers have been called
```javascript
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
//  intellisense ↓
    const { someNumber } = await eCalculate.fire({ someNumber: 6 });
    console.log('someNumber', someNumber); //output: someNumber 36
}
```

We use this for object enrichments or mutations
```javascript
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
```

### Simple State Mgmt
With EhState you simply manage states.
EhState requires an initial state object to initialize, and functions very similarly to EhEvent, with 3 main differences:
1. EhState maintains a state object
2. All event handlers are immediately invoked upon registration with the current state
3. Fire function updates or mutates state

Example:
```javascript
// Initialize EhState with the initial desired state
const loadedState = EhState.fromInitialState({ isLoaded: false });

// handler will be fired as soon as it is registered, with the current state
loadedState.register(state => {
    console.count('state handler A');
    console.log('state', state);
    /**
     * First invocation with initial state
     * Further invocations due to fire function calls
     * Output:
     * state handler A: 1
     * state { isLoaded: false }
     * state handler A: 2
     * state { isLoaded: true }
     * state handler A: 3
     * state { isLoaded: true, count: 1 }
     */
});

// fire will merge the argument into the current stored state (using Object.assign), and then invoke all handlers (like EhEvent)
loadedState.fire({ isLoaded: true });

// handler will be fired as soon as it is registered, with the current state
loadedState.register(state => {
    console.count('state handler B');
    console.log('state', state);
    /**
     * First invocation with current state (after first fire)
     * Second invocation with second fire (mutation)
     * Output:     
     * state handler B: 1
     * state { isLoaded: true }
     * state handler B: 2
     * state { isLoaded: true, count: 1 }
     */
});

// Unnested mutations to state are allowed. Handlers will be invoked
// with the object results from Object.assign of current state and your argument
loadedState.fire({ count: 1 });
```

### React
This shows how to use eh in React class components
```javascript
// use the EhEvent.fromInstance instantiator to use a simple object as an event template
const eventChangeColor = EhEvent.fromInstance({ color: "" });

class Picker extends Component {
  constructor(props) {
    super(props);

    // create event-firing-functions ("cannons") for buttons
    this.cannonPickBlue = () => eventChangeColor.fire({ color: "blue" });
    this.cannonPickRed = () => eventChangeColor.fire({ color: "red" });
  }

  render() {
    return (
      <div className="picker">
        <button onClick={this.cannonPickBlue}>Blue</button>
        <button onClick={this.cannonPickRed}>Red</button>
      </div>
    );
  }
}

class ColorDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { color: "yellow" };

    // register a handler that updates state
    eventChangeColor.register(({ color }) => this.setState({ color }));
  }

  render() {
    return (
      <div className="display" style={{ backgroundColor: this.state.color }} />
    );
  }
}
```
Full example on CodeSandbox

[![Edit Eh React Basic Example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/r7vqw6qro)