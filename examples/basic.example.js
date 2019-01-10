
import eh from '../dist/index';

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