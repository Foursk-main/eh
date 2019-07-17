# eh - simple event manager

Eh provides simple and flexible event management.

For any questions, comments, feedback or hi-saying feel free to hit me up:
mcr@foursk.com

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
Using EhEvent, you can create event instances that contain name and data structure.
You can use a class or an object instance.
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

// use the EhEvent.fromInstance instantiator, with a template instance. 
// use redundant data of desired type to "inform" intellisense
const imaginaryConcertEvent = EhEvent.fromInstance({ artist: '' });

imaginaryConcertEvent.register(({ artist }) => console.log(`${artist} is performing tonight!`));

imaginaryConcertEvent.fire(({ artist: 'John Lennon' }));

// Output: John Lennon is performing tonight!
```

EhEvent usage comes with pretty comfortable intellisense support

![alt text](https://github.com/Foursk-main/eh/raw/master/examples/snips/ehEventIntellisense.png "Intellisense support")

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

## Yet to be documented
- Promises
- EhEvent from instance
- Error handling
- Many to one/One to many
- Event chains
- Demo