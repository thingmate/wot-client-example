import { IRGBColor } from '@lifaon/color';
import { $$map, IObservable, IObserver, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatLoadingComponent } from '@lirx/dom-material';
import { IColorThingProperty, IRGBCW } from '@thingmate/wot-scripting-api';
import { WidgetColorPickerComponent } from '../../../../fragments/widget-color-picker/widget-color-picker.component';
import { WidgetRangePickerComponent } from '../../../../fragments/widget-range-picker/widget-range-picker.component';
import { createThingColorPickerComponentContext } from '../thing-color-picker.store';

// @ts-ignore
import html from './thing-color-picker-rgbcw.component.html?raw';
// @ts-ignore
import style from './thing-color-picker-rgbcw.component.scss?inline';

/**
 * COMPONENT: 'app-thing-color-picker-rgbcw'
 **/

interface IData {
  readonly loading$: IObservable<boolean>;
  readonly $rgbPicker: IObservable<IObserver<IRGBColor>>;
  readonly rgbPicker$: IObservable<IRGBColor>;
  readonly $coldPicker: IObservable<IObserver<number>>;
  readonly coldPicker$: IObservable<number>;
  readonly $warmPicker: IObservable<IObserver<number>>;
  readonly warmPicker$: IObservable<number>;
}

interface IThingColorPickerRGBCWComponentConfig {
  element: HTMLElement;
  inputs: [
    ['property', IColorThingProperty],
  ],
  data: IData;
}

export const ThingColorPickerRGBCWComponent = createComponent<IThingColorPickerRGBCWComponentConfig>({
  name: 'app-thing-color-picker-rgbcw',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatLoadingComponent,
      WidgetColorPickerComponent,
      WidgetRangePickerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['property'],
  ],
  init: (node: VirtualCustomElementNode<IThingColorPickerRGBCWComponentConfig>): IData => {
    const property$ = node.inputs.get$('property');

    /* CONTEXT */

    const {
      loading$,
      getColor,
      $color,
      color$,
    } = createThingColorPickerComponentContext(property$);

    /* RGB */

    const $rgbPicker = map$$($color, ($color: IObserver<IRGBCW>): IObserver<IRGBColor> => {
      return $$map($color, (rgb: IRGBColor): IRGBCW => {
        return {
          ...getColor(),
          ...rgb,
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

    /* COLD */

    const $coldPicker = map$$($color, ($color: IObserver<IRGBCW>): IObserver<number> => {
      return $$map($color, (c: number): IRGBCW => {
        return {
          ...getColor(),
          c,
        };
      });
    });

    const coldPicker$ = map$$(color$, ({ c }: IRGBCW): number => {
      return c;
    });

    /* WARM */

    const $warmPicker = map$$($color, ($color: IObserver<IRGBCW>): IObserver<number> => {
      return $$map($color, (w: number): IRGBCW => {
        return {
          ...getColor(),
          w,
        };
      });
    });

    const warmPicker$ = map$$(color$, ({ w }: IRGBCW): number => {
      return w;
    });

    return {
      loading$,
      $rgbPicker,
      rgbPicker$,
      $coldPicker,
      coldPicker$,
      $warmPicker,
      warmPicker$,
    };
  },
});
