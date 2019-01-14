import { eh, EhTypedHandler, EventHub } from './EventHub';

export type EhEventHandler<T> = (data: T) => Promise<T>;

let generatedEventsCounter = 0;
const makeName = (original: string) => `${original}_${generatedEventsCounter++}`;

export class EhEvent<T> {
  public static fromInstance<ST>(
    instance: ST,
    name: string = makeName(instance.constructor.name),
    eventHub: EventHub = eh,
  ) {
    return new EhEvent<ST>(name, eventHub);
  }

  public static fromClass<ST>(theclass: new () => ST, name: string = makeName(theclass.name), eventHub: EventHub = eh) {
    return new EhEvent<ST>(name, eventHub);
  }

  public name: string;
  protected eventHub: EventHub;
  // protected handlers: Array<EhTypedHandler<T>>;

  constructor(name: string, eventHub: EventHub = eh) {
    this.name = name;
    this.eventHub = eventHub;
    // this.handlers = [];
  }

  public fire(data: T, eventHub: EventHub = this.eventHub) {
    return eventHub.fire(this.name, data);
    // return eventHub.fire(this.name, data, this.handlers);
  }

  public register(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    const retval = eventHub.register<T>(this.name, handler);
    // this.handlers = retval.handlers;
    // const originalUnregister = retval.unregister;
    // retval.unregister = () => this.handlers = originalUnregister();
    return retval;
  }

  public unregister(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    // this.handlers =
    return eventHub.unregister(this.name, handler);
  }
}
