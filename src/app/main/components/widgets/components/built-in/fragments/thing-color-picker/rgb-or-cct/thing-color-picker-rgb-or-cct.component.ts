import { IRGBColor } from '@lifaon/color';
import { Abortable } from '@lirx/async-task';
import { $$map, IObservable, IObserver, let$$, map$$, shareRL$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component, input, Input, VirtualComponentNode } from '@lirx/dom';
import { MatLoadingComponent } from '@lirx/dom-material';
import {
  IClassNamesList,
} from '@lirx/dom/';
import { IconGradientHorizontalComponent, IconPaletteOutlineComponent } from '@lirx/mdi';
import { cct_to_cw, cw_to_cct, ICCT, IColorThingProperty, IRGBCW } from '@thingmate/wot-scripting-api';
import { WidgetColorPickerComponent } from '../../../../fragments/widget-color-picker/widget-color-picker.component';
import { WidgetIconButtonComponent } from '../../../../fragments/widget-icon-button/widget-icon-button.component';
import { WidgetRangePickerComponent } from '../../../../fragments/widget-range-picker/widget-range-picker.component';
import { createThingColorPickerComponentContext } from '../thing-color-picker.store';
import { IUnsubscribe } from '@lirx/unsubscribe';

// @ts-ignore
import html from './thing-color-picker-rgb-or-cct.component.html?raw';
// @ts-ignore
import style from './thing-color-picker-rgb-or-cct.component.scss?inline';

/**
 * COMPONENT: 'app-thing-color-picker-rgb-or-cct'
 **/

export interface IThingColorPickerComponentData {
  readonly property: Input<IColorThingProperty>;
}

type IThingColorPickerMode =
  | 'cct'
  | 'rgb'
  ;

interface ITemplateData {
  readonly loading$: IObservable<boolean>;
  readonly mode$: IObservable<IThingColorPickerMode>;
  readonly $onClickToggleModeButton: IObserver<Event>;
  readonly modeAsText$: IObservable<string>;
  readonly $rgbPicker: IObservable<IObserver<IRGBColor>>;
  readonly rgbPicker$: IObservable<IRGBColor>;
  readonly $temperaturePicker: IObservable<IObserver<number>>;
  readonly temperaturePicker$: IObservable<number>;
  readonly $brightnessPicker: IObservable<IObserver<number>>;
  readonly brightnessPicker$: IObservable<number>;
}

export const ThingColorPickerRgbOrCctComponent = new Component<HTMLElement, IThingColorPickerComponentData, ITemplateData>({
  name: 'app-thing-color-picker-rgb-or-cct',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      MatLoadingComponent,
      IconGradientHorizontalComponent,
      IconPaletteOutlineComponent,
      WidgetIconButtonComponent,
      WidgetColorPickerComponent,
      WidgetRangePickerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IThingColorPickerComponentData => {
    return {
      property: input<IColorThingProperty>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IThingColorPickerComponentData>): ITemplateData => {
    const property$ = node.input$('property');

    /* MODE */

    const [$mode, mode$, getMode] = let$$<IThingColorPickerMode>();

    const $onClickToggleModeButton = (): void => {
      const mode: IThingColorPickerMode = (getMode() === 'cct')
        ? 'rgb'
        : 'cct';
      $mode(mode);
    };

    node.onConnected((): IUnsubscribe => {
      return property$((property: IColorThingProperty): void => {
        property.read(Abortable.never)
          .successful(({ r, g, b }: IRGBCW): void => {
            const mode: IThingColorPickerMode = (
              (r === 0)
              && (g === 0)
              && (b === 0)
            )
              ? 'cct'
              : 'rgb';
            $mode(mode);
          });
      });
    });

    const modeAsText$ = map$$(mode$, (mode: IThingColorPickerMode): string => {
      switch (mode) {
        case 'cct':
          return 'Switch to color mode';
        case 'rgb':
          return 'Switch to white mode';
      }
    });

    node.setReactiveClassNamesList(map$$(mode$, (mode: IThingColorPickerMode): IClassNamesList => {
      return new Set([`mode-${mode}`]);
    }));

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

    /* CCT */

    const $cct = shareRL$$(
      map$$($color, ($color: IObserver<IRGBCW>): IObserver<ICCT> => {
        return $$map($color, (cct: ICCT): IRGBCW => {
          return {
            r: 0,
            g: 0,
            b: 0,
            ...cct_to_cw(cct),
          };
        });
      }),
    );

    const cct$ = shareRL$$(
      map$$(color$, (color: IRGBCW): ICCT => {
        return cw_to_cct(color);
      }),
    );

    const getCCT = (): ICCT => {
      return cw_to_cct(getColor());
    };

    /* TEMPERATURE */

    const $temperaturePicker = map$$($cct, ($cct: IObserver<ICCT>): IObserver<number> => {
      return $$map($cct, (temperature: number): ICCT => {
        let { brightness }: ICCT = getCCT();
        return {
          brightness: (brightness === 0) ? 1 : brightness,
          temperature,
        };
      });
    });

    const temperaturePicker$ = map$$(cct$, ({ temperature }: ICCT): number => {
      return temperature;
    });

    /* BRIGHTNESS */

    const $brightnessPicker = map$$($cct, ($cct: IObserver<ICCT>): IObserver<number> => {
      return $$map($cct, (brightness: number): ICCT => {
        return {
          ...getCCT(),
          brightness,
        };
      });
    });

    const brightnessPicker$ = map$$(cct$, ({ brightness }: ICCT): number => {
      return brightness;
    });

    return {
      loading$,
      mode$,
      $onClickToggleModeButton,
      modeAsText$,
      $rgbPicker,
      rgbPicker$,
      $temperaturePicker,
      temperaturePicker$,
      $brightnessPicker,
      brightnessPicker$,
    };
  },
});


