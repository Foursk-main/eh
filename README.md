# eh - simple & tiny event manager

Eh provides simple and flexible event management.

## Usage
    npm i -s eh

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