// for hoc - withEhEvent(eventName, handlerToProps :(data: )=> {})
// handles event, returns props

export type Handler = (data: any, name: string) => void | Promise<any>;

interface IRegistration {
  [eventName: string]: [Handler];
}

interface IEhInternalRecursion<T> {
  resolve: (value: T) => void;
  data: T;
  name: string;
  handlers: [(data: T, name: string) => void | Promise<T>];
  idx: number;
}

function fireInternalRecursive<T>(ir: IEhInternalRecursion<T>) {
  if (ir.idx === ir.handlers.length) {
    return ir.resolve(ir.data);
  }

  const handlerRetVal = ir.handlers[ir.idx](ir.data, ir.name);
  ir.idx++;

  if (isPromise(handlerRetVal)) {
    handlerRetVal.then(() => fireInternalRecursive<T>(ir));
  } else {
    fireInternalRecursive(ir);
  }
}

function isPromise<T>(res: void | Promise<T>): res is Promise<T> {
  // let casted = (<Promise<T>>res);
  return res !== undefined && res.then !== undefined;
}

export class EventHub {
  private registrations: IRegistration;

  constructor() {
    this.registrations = {};
  }

  public register<T>(name: string, handler: (data: T, name: string) => void | Promise<T>) {
    const handlers = this.registrations[name];

    if (handlers) {
      handlers.push(handler);
    } else {
      this.registrations[name] = [handler];
    }

    return handlers;
  }

  public fire<T>(name: string, data: T, handlers?: [Handler]) {
    if (!handlers) {
      handlers = this.registrations[name];
    }
    return new Promise<T>(resolve => {
      if (handlers) {
        // fireInternalRecursive(resolve, data, name, handlers, 0);
        fireInternalRecursive({ resolve, data, name, handlers, idx: 0 });
      }
      else {
        resolve(data);
      }
    });
  }
}

/**
 * Global EventHub instance. If you don't have a reason to create a separate one, use this one.
 */
export const eh = new EventHub();
