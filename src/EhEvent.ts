import { eh, EventHub } from './EventHub';

export type EhEventHandler<T> = (data: T) => Promise<T>;

let generatedEventsCounter = 0;
export const makeName = (original: string) => `${original}_${generatedEventsCounter++}`;

export class EhEvent<T extends object> {
  public static fromInstance<ST extends object>(
    instance: ST,
    name: string = makeName(instance.constructor.name),
    eventHub: EventHub = eh,
  ) {
    return new EhEvent<ST>(name, eventHub);
  }

  public static fromClass<ST extends object>(theclass: new () => ST, name: string = makeName(theclass.name), eventHub: EventHub = eh) {
    return new EhEvent<ST>(name, eventHub);
  }

  public name: string;
  protected eventHub: EventHub;

  constructor(name: string, eventHub: EventHub = eh) {
    this.name = name;
    this.eventHub = eventHub;
  }

  public fire(data: T, eventHub: EventHub = this.eventHub) {
    return eventHub.fire(this.name, data);
  }

  public register(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    const retval = eventHub.register<T>(this.name, handler);
    return retval;
  }

  public unregister(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    return eventHub.unregister(this.name, handler);
  }
}
