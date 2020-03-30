// const { EhState } = require('../dist');
import { EhState } from '../dist';

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