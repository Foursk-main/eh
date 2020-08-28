export type EhHandler = (data: any, name: string) => void | Promise<any>;
export type EhTypedHandler<T> = (data: T, name: string) => void | Promise<T>;

interface IRegistration {
  [eventName: string]: EhHandler[];
}

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

  /**
   * Register a handler that will be invoked each time the "fire" function is called with your event name
   * @param name Name of event to register for. Each time an event with this name will be fired, your handler will be called
   * @param handler function that handles the event. The function expects a T object
   */
  public register<T>(name: string, handler: EhTypedHandler<T>) {
    const handlers = this.registrations[name];

    if (handlers) {
      handlers.push(handler);
    } else {
      this.registrations[name] = [handler];
    }

    return {
      handlers,
      unregister: () => this.unregister(name, handler),
    };
  }

  /**
   * Register a handler that will be invoked *ONE* time, when the "fire" function is called
   * @param name Name of event to register for. Each time an event with this name will be fired, your handler will be called
   * @param handler function that handles the event. The function expects a T object
   */
  public registerOnce<T>(name: string, handler: EhTypedHandler<T>) {
    const retval = this.register<T>(name, (data) => {
      retval.unregister();
      return handler(data, name);
    });

    return retval;
  }

  public unregister<T>(name: string, handler: EhTypedHandler<T>) {
    const newHandlers = this.registrations[name].filter(h => h !== handler);
    this.registrations[name] = newHandlers;
    return newHandlers;
  }

  /**
   * Invoke an event and pass data to all its registered handlers
   * @param name Name of event to fire. All handlers registered with this name will be invoked.
   * @param data Data to pass to handlers. Depending on your handlers, the data may be modified.
   * @param handlers Override the registered handlers with a custom list of handlers. Leave this empty to use the normal flow.
   */
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

  /**
   * Create a dedicated function for firing your event
   * @param name Name of event to be fired each time your function is called
   */
  public cannon<T>(name: string) {
    return (data: T, handlers?: EhHandler[]) => this.fire(name, data, handlers);
  }
}

/**
 * Global EventHub instance. If you don't have a reason to create a separate one, use this one.
 */
export const eh = new EventHub();
