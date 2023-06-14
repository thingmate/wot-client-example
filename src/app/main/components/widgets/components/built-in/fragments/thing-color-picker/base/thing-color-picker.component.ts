import { IRGBColor } from '@lifaon/color';
import { Abortable, AsyncTask, IAbortFunction } from '@lirx/async-task';
import {
  $$map,
  $log, computed, createMulticastSource, createUnicastSource, debounceTime$$,
  distinct$$$, effect,
  IDefaultNotificationsUnion,
  IObservable,
  IObserver,
  let$$, map$$, merge,
  notificationsToImmediate$$$,
  pipe$$, rejected$$, shareRL$$,
  shareRL$$$, signal, single, switchMap$$,
  switchMap$$$, then$$, thenAny$$, toSignal,
} from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatLoadingComponent } from '@lirx/dom-material';
import {
  DeferredAction,
  DeferredAsyncAction,
  DeferredSelector,
  Immutable,
  IWriteStateFunction,
  IReadStateFunction,
  Store,
} from '@lirx/store';
import { IPushSinkWithBackPressure } from '@lirx/stream';
import { createTimeout, IUnsubscribe, noop } from '@lirx/utils';
import { are_rgbcw_equal, cct_to_cw, cw_to_cct, ICCT, IColorThingProperty, ICW, IRGBCW } from '@thingmate/wot-scripting-api';
import { fromAsyncTaskFactory } from '../../../../../../../../misc/from-async-task-factory';
import { fromPushSourceWithBackPressure } from '../../../../../../../../misc/from-push-source-with-back-pressure';
import { WidgetColorPickerComponent } from '../../../fragments/widget-color-picker/widget-color-picker.component';
import { WidgetRangePickerComponent } from '../../../fragments/widget-range-picker/widget-range-picker.component';

// @ts-ignore
import html from './thing-color-picker.component.html?raw';
// @ts-ignore
import style from './thing-color-picker.component.scss?inline';

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
  return property.write(color, abortable)
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
  return property.observe()((color: IRGBCW, abortable: Abortable): AsyncTask<void> => {
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

/**
 * COMPONENT: 'app-thing-color-picker'
 **/

interface IData {
  readonly loading$: IObservable<boolean>;
  readonly $rgbPicker: IObservable<IObserver<IRGBColor>>;
  readonly rgbPicker$: IObservable<IRGBColor>;
  // readonly $temperaturePicker: IObserver<number>;
  // readonly temperaturePicker$: IObservable<number>;
  // readonly $brightnessPicker: IObserver<number>;
  // readonly brightnessPicker$: IObservable<number>;
}

interface IThingColorPickerComponentConfig {
  element: HTMLElement;
  inputs: [
    ['property', IColorThingProperty],
  ],
  data: IData;
}

export const ThingColorPickerComponent = createComponent<IThingColorPickerComponentConfig>({
  name: 'app-thing-color-picker',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetColorPickerComponent,
      MatLoadingComponent,
      WidgetRangePickerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['property'],
  ],
  init: (node: VirtualCustomElementNode<IThingColorPickerComponentConfig>): IData => {
    const property$ = node.inputs.get$('property');

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

    const loading$ = loadingSelector.get$();
    const color$ = colorSelector.get$();

    const $rgbPicker = map$$($color, ($color: IObserver<IRGBCW>): IObserver<IRGBColor> => {
      return $$map($color, (rgb: IRGBColor): IRGBCW => {
        return {
          ...rgb,
          c: 0,
          w: 0,
        };
      });
    });

    const rgbPicker$ = map$$(color$, ({ r, g, b }: IRGBCW): IRGBColor => {
      return {
        r,
        g,
        b,
      };
    });

    return {
      loading$,
      $rgbPicker,
      rgbPicker$,
      // $temperaturePicker,
      // temperaturePicker$,
      // $brightnessPicker,
      // brightnessPicker$,
    };
  },
});

// export function observeWithCleanUp<GValue>(
//   subscribe: IObservable<GValue>,
//   observer: (value: GValue) => IUnsubscribe,
// ): IUnsubscribe {
//   let cleanUpFunction: IUnsubscribe | undefined;
//
//   const clean = (): void => {
//     if (cleanUpFunction !== void 0) {
//       cleanUpFunction();
//     }
//   };
//
//   const unsubscribe = subscribe((value: GValue) => {
//     clean();
//     cleanUpFunction = observer(value);
//   });
//
//   return (): void => {
//     unsubscribe();
//     clean();
//   };
// }
