import { EventHub } from '.';
import { EhEvent, EhEventHandler, makeName } from './EhEvent';
import { eh } from './EventHub';

export class EhState<T extends object> extends EhEvent<T> {
  /**
   *
   * @param initialState An instance (partial or complete) of this object will be expected when state-event is fired and handled
   * @param name A unique name for the event. Defaults to a random unique name
   * @param eventHub A custom EventHub for this EhEvent to use. Defaults to the global event handler (recommended)
   */
  public static fromInitialState<ST extends object>(
    initialState: ST,
    name: string = makeName(initialState.constructor.name),
    eventHub: EventHub = eh,
  ) {
    return new EhState<ST>(initialState, name, eventHub);
  }

  /**
   * USE THIS FROM EhEvent
   */
  public static fromInstance<ST extends object>(instance: ST, name: string, eventHub: EventHub) {
    throw new Error('Use this function from EhEvent');
    return new EhEvent<ST>('');
  }

  /**
   * USE THIS FROM EhEvent
   */
  public static fromClass<ST extends object>(theclass: new () => ST, name: string, eventHub: EventHub) {
    throw new Error('Use this function from EhEvent');
    return new EhEvent<ST>('');
  }

  private stateData: T;

  /**
   *
   * @param initialState The initial state of this EhState. An instance (partial or complete) of this object will be expected when state-event is fired and handled
   * @param name A unique name for the event. Defaults to a random unique name
   * @param eventHub A custom EventHub for this EhEvent to use. Defaults to the global event handler (recommended)
   */
  constructor(initialState: T, name: string, eventHub: EventHub = eh) {
    super(name, eventHub);
    this.stateData = initialState;
  }

  /**
   *
   * @param data Data of type T that will be merged into the saved state of this EhState (using Object.assign). Data will be sent to all handlers of this EhState
   * @param eventHub A custom EventHub to to fire data with. Defaults to initially registered EventHub (recommended)
   */
  public fire(data: T, eventHub: EventHub = this.eventHub) {
    Object.assign(this.stateData, data);
    return super.fire(this.stateData, eventHub);
  }

  /**
   * Register a handler that will be invoked instantly with the current state, as well as each time the state is changed
   * @param handler function that handles the state change. The function expects a T object
   * @param eventHub A custom EventHub to register this handler with. Defaults to initially registered EventHub (recommended)
   */
  public register(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    const retval = super.register(handler, eventHub);
    handler(this.stateData);
    return retval;
  }

  /**
   * Returns a DIRECT REFERENCE to the current state object. DO NOT CHANGE THE RETURNED VALUE DIRECTLY
   */
  public get state() {
    return this.stateData;
  }
}
