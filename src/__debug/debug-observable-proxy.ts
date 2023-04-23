import {
  $log,
  createMulticastReplayLastSource,
  IMulticastReplayLastSource,
  IObservable,
  IObserver,
  let$$,
  mapObservable, mapObserver,
} from '@lirx/core';
import { verifyNumberInRange } from '@lirx/utils';
import { ObservableProxy } from '../misc/observable-proxy.class';

/*--------------*/

export type IConvertArrayOfValuesToArrayOfObservables<GArray extends any[]> = {
  [GKey in keyof GArray]: IObservable<GArray[GKey]>;
}

export type IConvertArrayOfValuesToArrayOfObservers<GArray extends any[]> = {
  [GKey in keyof GArray]: IObserver<GArray[GKey]>;
}

export function createObservableArrayProxy<GArray extends any[]>(
  array$: IObservable<GArray>,
): IObservable<IConvertArrayOfValuesToArrayOfObservables<GArray>> {
  let _cachedArrayLength: number = 0;
  const _arrayOfObservables: IConvertArrayOfValuesToArrayOfObservables<GArray> = [] as any;
  const _arrayOfObservers: IConvertArrayOfValuesToArrayOfObservers<GArray> = [] as any;

  return mapObservable(array$, (array: GArray): IConvertArrayOfValuesToArrayOfObservables<GArray> => {
    const arrayLength: number = array.length;

    if (arrayLength !== _cachedArrayLength) {
      _arrayOfObservables.length = arrayLength;
      _arrayOfObservers.length = arrayLength;

      if (arrayLength > _cachedArrayLength) {
        for (let i = _cachedArrayLength; i < arrayLength; i++) {
          const { emit, subscribe }: IMulticastReplayLastSource<unknown> = createMulticastReplayLastSource<unknown>();
          _arrayOfObservables[i] = subscribe;
          _arrayOfObservers[i] = emit;
        }
      }

      _cachedArrayLength = arrayLength;
    }

    for (let i = 0; i < arrayLength; i++) {
      _arrayOfObservers[i](array[i]);
    }

    return _arrayOfObservables;
  });
}

/*--------------*/

// export type IConvertObjectOfValuesToObjectOfObservables<GObject extends object> = {
//   [GKey in keyof GObject]: IObservable<GObject[GKey]>;
// }
//
// export type IConvertObjectOfValuesToObjectOfObservers<GObject extends object> = {
//   [GKey in keyof GObject]: IObserver<GObject[GKey]>;
// }
//
// export function createObservableObjectProxy<GObject extends object>(
//   object$: IObservable<GObject>,
// ): IObservable<IConvertObjectOfValuesToObjectOfObservables<GObject>> {
//   let _cachedArrayLength: number = 0;
//   const _arrayOfObservables: IConvertArrayOfValuesToArrayOfObservables<GArray> = [] as any;
//   const _arrayOfObservers: IConvertArrayOfValuesToArrayOfObservers<GArray> = [] as any;
//
//   return mapObservable(object$, (obj: GObject): IConvertArrayOfValuesToArrayOfObservables<GArray> => {
//     const arrayLength: number = array.length;
//
//     if (arrayLength !== _cachedArrayLength) {
//       _arrayOfObservables.length = arrayLength;
//       _arrayOfObservers.length = arrayLength;
//
//       if (arrayLength > _cachedArrayLength) {
//         for (let i = _cachedArrayLength; i < arrayLength; i++) {
//           const { emit, subscribe }: IMulticastReplayLastSource<unknown> = createMulticastReplayLastSource<unknown>();
//           _arrayOfObservables[i] = subscribe;
//           _arrayOfObservers[i] = emit;
//         }
//       }
//
//       _cachedArrayLength = arrayLength;
//     }
//
//     for (let i = 0; i < arrayLength; i++) {
//       _arrayOfObservers[i](array[i]);
//     }
//
//     return _arrayOfObservables;
//   });
// }

/*--------------*/

export interface IObservableArrayOptions {
  emitUndefinedForIndexesOutOfRangeWhenSettingData?: boolean;
}

export class ObservableArray<GValue> implements Iterable<IObservable<GValue>> {
  protected readonly _data: IMulticastReplayLastSource<GValue>[];
  protected readonly _$length$: IMulticastReplayLastSource<number>;
  protected readonly _emitUndefinedForIndexesOutOfRangeWhenSettingData: boolean;

  constructor(
    {
      emitUndefinedForIndexesOutOfRangeWhenSettingData = true,
    }: IObservableArrayOptions = {},
  ) {
    this._data = [];
    this._$length$ = createMulticastReplayLastSource<number>(0);
    this._emitUndefinedForIndexesOutOfRangeWhenSettingData = emitUndefinedForIndexesOutOfRangeWhenSettingData;
  }

  get length$(): IObservable<number> {
    return this._$length$.subscribe;
  }

  setData(
    data: ArrayLike<GValue>,
  ): void {
    const currentDataLength: number = this._data.length;
    const newDataLength: number = data.length;

    if (this._emitUndefinedForIndexesOutOfRangeWhenSettingData) {
      for (let i = newDataLength; i < currentDataLength; i++) {
        this._data[i].emit(void 0 as any);
      }
    }

    this._data.length = newDataLength;

    for (let i = currentDataLength; i < newDataLength; i++) {
      this._data[i] = createMulticastReplayLastSource<GValue>();
    }

    for (let i = 0; i < newDataLength; i++) {
      this._data[i].emit(data[i]);
    }

    this._$length$.emit(newDataLength);
  }

  get(
    index: number,
  ): GValue {
    return this.getSource(index).getValue();
  }

  set(
    index: number,
    value: GValue,
  ): void {
    this.getSource(index).emit(value);
  }

  get$(
    index: number,
  ): IObservable<GValue> {
    return this.getSource(index).subscribe;
  }

  * values(): Generator<GValue> {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[i].getValue();
    }
  }

  * values$(): Generator<IObservable<GValue>> {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[i].subscribe;
    }
  }

  [Symbol.iterator](): Generator<IObservable<GValue>> {
    return this.values$();
  }

  protected getSource(
    index: number,
  ): IMulticastReplayLastSource<GValue> {
    verifyNumberInRange(index, 'index', { min: 0, minIncluded: true, max: this._data.length, maxIncluded: false });
    return this._data[index];
  }
}

/*--------------*/



// export class ObservableProxy<GValue> {
//   readonly value$: IObservable<GValue>;
//   readonly $value: IObserver<GValue>;
//
//   constructor(
//     value$: IObservable<GValue>,
//     $value: IObserver<GValue>,
//   ) {
//     this.value$ = value$;
//     this.$value = $value;
//   }
//
//   get<GKey extends keyof GValue>(
//     propertyKey: GKey,
//   ): ObservableProxy<GValue[GKey]> {
//     return new ObservableProxy<GValue[GKey]>(
//       mapObservable(this.value$, (data: GValue): GValue[GKey] => {
//         return data[propertyKey];
//       }),
//       mapObserver(this.$value, (data: GValue[GKey]): GValue => {
//         return {
//           [propertyKey]: data;
//         };
//       }),
//     );
//   }
//
//   iterate(): any {
//
//   }
// }

/*--------------*/

function debugObservableProxy1(): void {
  type IArray = [number, number, number, number];
  const [$array, array$] = let$$<IArray>([0, 1, 2, 3]);

  const proxy$ = createObservableArrayProxy(array$);

  proxy$((array) => {
    for (let i = 0, l = array.length; i < l; i++) {
      array[i]((v) => {
        console.log('v', i, v);
      });
    }
  });

  $array([5, 6, 7, 8]);
}

function debugObservableProxy2(): void {
  const a = {
    a: 'propA',
    b: [0, 1, 2],
  };

  type IA = typeof a;

  const [$a, a$] = let$$<IA>();

  const p$ = new ObservableProxy<IA>(a$);

  p$.get('a').get('length').value$($log);

  const array$ = p$.get('b').array$();

  array$((array) => {
    for (let i = 0, l = array.length; i < l; i++) {
      array[i].value$((v) => {
        console.log('v', i, v);
      });
    }
  });

  $a(a);
  $a({ a: 'abc', b: [8] });
  // $a({ b: [8] } as any);
}

/*--------------*/

export function debugObservableProxy(): void {
  // debugObservableProxy1();
  debugObservableProxy2();
}
