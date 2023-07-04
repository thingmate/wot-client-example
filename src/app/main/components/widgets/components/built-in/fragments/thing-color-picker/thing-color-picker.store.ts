import { Abortable, AsyncTask, IAbortFunction } from '@lirx/async-task';
import { IObservable, IObserver, pipe$$, shareRL$$, shareRL$$$, switchMap$$$ } from '@lirx/core';
import {
  DeferredAction,
  DeferredAsyncAction,
  DeferredSelector,
  Immutable,
  IReadStateFunction,
  IWriteStateFunction,
  Store,
} from '@lirx/store';
import { createTimeout, IUnsubscribe } from '@lirx/utils';
import { are_rgbcw_equal, IColorThingProperty, IRGBCW } from '@thingmate/wot-scripting-api';
import { getThingPropertyObserveFunction } from '../../../../../../../../misc/observe-thing-property';

/** STORE **/

type IState = Immutable<{
  loading: boolean;
  color: Immutable<IRGBCW>;
}>;

/* ACTIONS */

const deferredColorAction = new DeferredAction<IState, [IRGBCW]>((state: IState, color: IRGBCW): IState => {
  return {
    ...state,
    color,
  };
});

interface IWriteColorThingPropertyActionOptions {
  property: IColorThingProperty;
  color: IRGBCW;
}

const deferredWriteColorThingPropertyAction = new DeferredAsyncAction<IState, IWriteColorThingPropertyActionOptions>((
  {
    property,
    color,
  }: IWriteColorThingPropertyActionOptions,
  read: IReadStateFunction<IState>,
  write: IWriteStateFunction<IState>,
  abortable: Abortable,
): AsyncTask<void> => {
  write({
    ...read(),
    loading: true,
  });
  return property.write!(color, abortable)
    .finally(() => {
      write({
        ...read(),
        color,
        loading: false,
      });
    });
});

const deferredObserveColorThingPropertyAction = new DeferredAsyncAction<IState, IColorThingProperty>((
  property: IColorThingProperty,
  read: IReadStateFunction<IState>,
  write: IWriteStateFunction<IState>,
  abortable: Abortable,
): AsyncTask<void> => {
  return getThingPropertyObserveFunction(property, 10e3)((color: IRGBCW, abortable: Abortable): AsyncTask<void> => {
    write({
      ...read(),
      color,
      loading: false,
    });
    return AsyncTask.void(abortable);
  }, abortable);
}, { queue: false });

/* SELECTORS */

const deferredLoadingSelector = new DeferredSelector<IState, boolean>((state: IState): boolean => {
  return state.loading;
});

const deferredColorSelector = new DeferredSelector<IState, IRGBCW>((state: IState): IRGBCW => {
  return state.color;
}, {
  equal: are_rgbcw_equal,
});

/** HELPERS **/

export interface IThingColorPickerComponentContext {
  loading$: IObservable<boolean>;
  getColor: IReadStateFunction<IRGBCW>;
  $color: IObservable<IObserver<IRGBCW>>;
  color$: IObservable<IRGBCW>;
}

export function createThingColorPickerComponentContext(
  property$: IObservable<IColorThingProperty>,
): IThingColorPickerComponentContext {

  const store = Store.create<IState>({
    loading: true,
    color: {
      r: 0,
      g: 0,
      b: 0,
      c: 0,
      w: 0,
    },
  });

  const colorAction = deferredColorAction.create(store);
  const writeColorThingPropertyAction = deferredWriteColorThingPropertyAction.create(store);
  const observeColorThingPropertyAction = deferredObserveColorThingPropertyAction.create(store);

  const loadingSelector = deferredLoadingSelector.create(store);
  const colorSelector = deferredColorSelector.create(store);

  const $color = pipe$$(property$, [
    switchMap$$$<IColorThingProperty, IObserver<IRGBCW>>((property: IColorThingProperty): IObservable<IObserver<IRGBCW>> => {
      return (
        emit: IObserver<IObserver<IRGBCW>>,
      ): IUnsubscribe => {
        // OBSERVE
        const [abortObserveColorThingProperty, observeColorThingPropertyAbortable] = Abortable.derive();
        observeColorThingPropertyAction.invoke(property, observeColorThingPropertyAbortable);

        // WRITE
        let timer: any;
        let writeColorAbort: IAbortFunction;

        const abortWriteColor = (
          reason: string = 'aborted',
        ): void => {
          if (timer !== void 0) {
            writeColorAbort(reason);
            clearTimeout(timer);
          }
        };

        const writeColor = (color: IRGBCW): void => {
          colorAction.invoke(color);

          abortWriteColor();

          timer = createTimeout((): void => {
            const abortable = new Abortable((abort: IAbortFunction): void => {
              writeColorAbort = abort;
            });

            writeColorThingPropertyAction.invoke({
              property,
              color,
            }, abortable);
          }, 500);
        };

        emit(writeColor);

        return (): void => {
          const reason = 'aborted';
          abortObserveColorThingProperty(reason);
          abortWriteColor(reason);
        };
      };
    }),
    shareRL$$$<IObserver<IRGBCW>>(),
  ]);

  const getColor = colorSelector.get;

  const loading$ = loadingSelector.get$();
  const color$ = shareRL$$(colorSelector.get$());

  return {
    loading$,
    getColor,
    $color,
    color$,
  };
}
