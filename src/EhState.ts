import { EventHub } from ".";
import { EhEvent, EhEventHandler, makeName } from './EhEvent';
import { eh } from "./EventHub";

export class EhState<T extends object> extends EhEvent<T> {
  public static fromInitialState<ST extends object>(initialState: ST, name: string = makeName(initialState.constructor.name), eventHub: EventHub = eh) {
    return new EhState<ST>(initialState, name, eventHub);
  }

  private stateData: T;

  constructor(initialState: T, name: string, eventHub: EventHub = eh) {
    super(name, eventHub);
    this.stateData = initialState;
  }

  public fire(data: T, eventHub: EventHub = this.eventHub) {
    Object.assign(this.stateData, data);
    return super.fire(this.stateData, eventHub);
  }

  public register(handler: EhEventHandler<T>, eventHub: EventHub = this.eventHub) {
    const retval = super.register(handler, eventHub);
    handler(this.stateData);
    return retval;
  }

  /**
   * DO NOT CHANGE THE RETURNED VALUE DIRECTLY
   */
  public get state() {
    return this.stateData;
  }
}