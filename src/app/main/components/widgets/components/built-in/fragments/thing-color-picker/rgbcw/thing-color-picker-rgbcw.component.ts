import { IRGBColor } from '@lifaon/color';
import { $$map, IObservable, IObserver, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component, input, Input, VirtualComponentNode } from '@lirx/dom';
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

export interface IThingColorPickerRGBCWComponentData {
  readonly property: Input<IColorThingProperty>;
}

interface ITemplateData {
  readonly loading$: IObservable<boolean>;
  readonly $rgbPicker: IObservable<IObserver<IRGBColor>>;
  readonly rgbPicker$: IObservable<IRGBColor>;
  readonly $coldPicker: IObservable<IObserver<number>>;
  readonly coldPicker$: IObservable<number>;
  readonly $warmPicker: IObservable<IObserver<number>>;
  readonly warmPicker$: IObservable<number>;
}



export const ThingColorPickerRGBCWComponent = new Component<HTMLElement, IThingColorPickerRGBCWComponentData, ITemplateData>({
  name: 'app-thing-color-picker-rgbcw',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      MatLoadingComponent,
      WidgetColorPickerComponent,
      WidgetRangePickerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IThingColorPickerRGBCWComponentData => {
    return {
      property: input<IColorThingProperty>(),
    }
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IThingColorPickerRGBCWComponentData>): ITemplateData => {
    const property$ = node.input$('property');

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
