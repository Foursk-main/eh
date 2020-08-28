import { eh, EventHub } from './EventHub';

export type EhEventHandler<T> = (data: T) => Promise<T>;

let generatedEventsCounter = 0;
export const makeName = (original: string) => `${original}_${generatedEventsCounter++}`;

export class EhEvent<T extends object> {
  /**
   * @param theclass An instance of this object will be expected when event is fired and handled
   * @param name A unique name for the event. Defaults to a random unique name
   * @param eventHub A custom EventHub for this EhEvent to use. Defaults to the global event handler (recommended)
   */
  public static fromInstance<ST extends object>(
    instance: ST,
    name: string = makeName(instance.constructor.name),
    eventHub: EventHub = eh,
  ) {
    return new EhEvent<ST>(name, eventHub);
  }

  /**
   *
   * @param theclass An instance of this class will be expected when event is fired and handled
   * @param name A unique name for the event. Defaults to a random unique name
   * @param eventHub A custom EventHub for this EhEvent to use. Defaults to the global event handler (recommended)
   */
  public static fromClass<ST extends object>(
    theclass: new () => ST,
    name: string = makeName(theclass.name),
    eventHub: EventHub = eh,
  ) {
    return new EhEvent<ST>(name, eventHub);
  }

  public name: string;
  protected eventHub: EventHub;

  /**
   *
   * @param name Unique name for the event
   * @param eventHub A custom EventHub for this EhEvent to use. Defaults to the global event handler (recommended)
   */
  constructor(name: string, eventHub: EventHub = eh) {
    this.name = name;
    this.eventHub = eventHub;
  }

  /**
   * Fire an instance of this event
   * @param data Data of type T that will be sent to all handlers for this EventHub.
   * @param eventHub A custom EventHub to fire data with. Defaults to initially registered EventHub (recommended)
   */
  public fire(data: T, eventHub: EventHub = this.eventHub) {
    return eventHub.fire(this.name, data);
  }

  /**
   * Register a handler that will be invoked each time the "fire" function is called
   * @param handler function that handles the event. The function expects a T object
   * @param eventHub A custom EventHub to register this handler with. Defaults to initially registered EventHub (recommended)
   */
  public register(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    const retval = eventHub.register<T>(this.name, handler);
    return retval;
  }

  /**
   * Register a handler that will be invoked *ONE* time, when the "fire" function is called
   * @param handler function that handles the event. The function expects a T object
   * @param eventHub A custom EventHub to register this handler with. Defaults to initially registered EventHub (recommended)
   */
  public registerOnce(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    const retval = eventHub.registerOnce<T>(this.name, handler);
    return retval;
  }

  /**
   * Receives a function and returns it, use for intellisense support when writing independent functions for a T object
   * @param handler create your function here, with intellisense
   */
  public createHandler(handler: EhEventHandler<T>) {
    return handler;
  }

  public unregister(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    return eventHub.unregister(this.name, handler);
  }
}
