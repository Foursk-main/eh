// const { EhEvent } = require('../dist');
import { EhEvent } from '../dist';

const keyEvent = { keyCode: 0, timestamp: 0 };

const eKeyDown = EhEvent.fromInstance(keyEvent);
const eKeyUp = EhEvent.fromInstance(keyEvent);

eKeyDown.register(e => {
    console.log('Key Down!', e);    
    e.keyDownHandled = true;

    // at the end of the handler, fire the next event in the chain 
    return eKeyUp.fire(e);
});

eKeyUp.register(e => {
    console.log('Key Up!', e);
});

eKeyDown.fire({ keyCode: 13, timestamp: Date.now() })
    .then(() => console.log('Key events chain complete!'));
/* Output:
    Key Down! { keyCode: 13, timestamp: 1585596055177 }
    Key Up! { keyCode: 13, timestamp: 1585596055177, keyDownHandled: true }
    Key events chain complete!
*/