export type EhHandler = (data: any, name: string) => void | Promise<any>;
export type EhTypedHandler<T> = (data: T, name: string) => void | Promise<T>;

interface IRegistration {
  [eventName: string]: EhHandler[];
};

interface IEhInternalRecursion<T> {
  resolve: (value: T) => void;
  data: T;
  name: string;
  // handlers: [(data: T, name: string) => void | Promise<T>];
  handlers: Array<EhTypedHandler<T>>;
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
  protected registrations: IRegistration;

  constructor() {
    this.registrations = {};
  }

  public register<T>(name: string, handler: EhTypedHandler<T>) {
    const handlers = this.registrations[name];

    if (handlers) {
      handlers.push(handler);
    } else {
      this.registrations[name] = [handler];
    }

    return {
      handlers,
      unregister: () => this.unregister(name, handler)
    };
  }

  public unregister<T>(name: string, handler: EhTypedHandler<T>) {
    const newHandlers = this.registrations[name].filter(h => h !== handler);
    this.registrations[name] = newHandlers;
    return newHandlers;
  }

  public fire<T>(name: string, data: T, handlers?: EhHandler[]) {
    if (!handlers) {
      handlers = this.registrations[name];
    }
    return new Promise<T>(resolve => {
      if (handlers) {
        // fireInternalRecursive(resolve, data, name, handlers, 0);
        fireInternalRecursive({ resolve, data, name, handlers, idx: 0 });
      } else {
        resolve(data);
      }
    });
  }
}

/**
 * Global EventHub instance. If you don't have a reason to create a separate one, use this one.
 */
export const eh = new EventHub();
