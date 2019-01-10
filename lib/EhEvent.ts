import { eh, EventHub, Handler } from './EventHub';

let generatedEventsCounter = 0;
const makeName = (original: string) => `${original}_${generatedEventsCounter++}`;

export class EhEvent<T> {
  public static fromInstance<ST>(instance: ST, name: string = makeName(instance.constructor.name), eventHub: EventHub = eh) {
    return new EhEvent<ST>(name, eventHub);
  }

  public static fromClass<ST>(theclass: new () => ST, name: string = makeName(theclass.name), eventHub: EventHub = eh) {
    return new EhEvent<ST>(name, eventHub);
  }

  public name: string;
  protected eventHub: EventHub;
  protected registrations: [Handler] | undefined;

  constructor(name: string, eventHub: EventHub = eh) {
    this.name = name;
    this.eventHub = eventHub;
    this.registrations = undefined;
  }

  public fire(data: T, eventHub: EventHub = this.eventHub) {
    return eventHub.fire(this.name, data, this.registrations);
  }

  public register(handler: (data: T) => Promise<T>, eventHub: EventHub = this.eventHub) {
    this.registrations = eventHub.register<T>(this.name, handler);
  }
}
