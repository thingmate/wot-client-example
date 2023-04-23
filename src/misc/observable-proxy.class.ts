import { createMulticastReplayLastSource, IMulticastReplayLastSource, IObservable, IObserver, mapObservable } from '@lirx/core';

export type IArrayOfValuesToArrayOfObservableProxy<GArray extends readonly any[]> = {
  [GKey in keyof GArray]: ObservableProxy<GArray[GKey]>;
}

export type IObservableProxyArray$<GValue> =
  GValue extends readonly any[]
    ? IObservable<IArrayOfValuesToArrayOfObservableProxy<GValue>>
    : never;


export class ObservableProxy<GValue> {
  readonly value$: IObservable<GValue>;
  protected _cachedGetProxies: Map<PropertyKey, ObservableProxy<unknown>>;
  protected _cachedArray$!: IObservableProxyArray$<GValue>;
  protected _cachedArray$Proxies: ObservableProxy<unknown>[];
  protected _cachedArray$Observers: IObserver<unknown>[];

  constructor(
    value$: IObservable<GValue>,
  ) {
    this.value$ = value$;
    this._cachedGetProxies = new Map<PropertyKey, ObservableProxy<unknown>>();
    this._cachedArray$Proxies = [];
    this._cachedArray$Observers = [];
  }

  get $(): IObservable<GValue> {
    return this.value$;
  }

  get<GKey extends keyof GValue>(
    propertyKey: GKey,
  ): ObservableProxy<GValue[GKey]> {
    let cachedProxy: ObservableProxy<unknown> | undefined = this._cachedGetProxies.get(propertyKey);
    if (cachedProxy === void 0) {
      cachedProxy = new ObservableProxy<GValue[GKey]>(
        mapObservable(this.value$, (value: GValue): GValue[GKey] => {
          return value?.[propertyKey] as GValue[GKey];
        }),
      );
      this._cachedGetProxies.set(propertyKey, cachedProxy);
    }
    return cachedProxy as ObservableProxy<GValue[GKey]>;
  }

  get$<GKey extends keyof GValue>(
    propertyKey: GKey,
  ): IObservable<GValue[GKey]> {
    return this.get(propertyKey).value$;
  }

  array$(): IObservableProxyArray$<GValue> {
    if (this._cachedArray$ === void 0) {
      this._cachedArray$ = mapObservable(this.value$, (array: GValue): unknown => {
        if (Array.isArray(array)) {
          const arrayLength: number = array.length;
          const cachedArray$ProxiesLength: number = this._cachedArray$Proxies.length;

          if (arrayLength !== cachedArray$ProxiesLength) {
            this._cachedArray$Proxies.length = arrayLength;
            this._cachedArray$Observers.length = arrayLength;

            if (arrayLength > cachedArray$ProxiesLength) {
              for (let i = cachedArray$ProxiesLength; i < arrayLength; i++) {
                const { emit, subscribe }: IMulticastReplayLastSource<unknown> = createMulticastReplayLastSource<unknown>();
                this._cachedArray$Proxies[i] = new ObservableProxy<unknown>(subscribe);
                this._cachedArray$Observers[i] = emit;
              }
            }
          }

          for (let i = 0; i < arrayLength; i++) {
            this._cachedArray$Observers[i](array[i]);
          }

          return this._cachedArray$Proxies;
        } else {
          throw new Error(`Not an array`);
        }
      }) as IObservableProxyArray$<GValue>;
    }
    return this._cachedArray$;
  }
}
