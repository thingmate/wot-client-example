import { css_rgb_hex_color_to_rgb, IRGBColor, rgb_to_css_rgb_hex_color } from '@lifaon/color';
import { $$map, IObservable, IObserver, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';

// @ts-ignore
import html from './widget-color-picker.component.html?raw';
// @ts-ignore
import style from './widget-color-picker.component.scss?inline';

/**
 * COMPONENT: 'app-widget-color-picker'
 **/

interface IData {
  readonly inputValue$: IObservable<string>;
  readonly $onInputChange: IObserver<Event>;
}

interface IWidgetColorPickerComponentConfig {
  element: HTMLElement;
  inputs: [
    ['value', IRGBColor],
  ];
  outputs: [
    ['value', IRGBColor],
  ];
  data: IData;
}

export const WidgetColorPickerComponent = createComponent<IWidgetColorPickerComponentConfig>({
  name: 'app-widget-color-picker',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['value'],
  ],
  outputs: [
    ['value'],
  ],
  init: (node: VirtualCustomElementNode<IWidgetColorPickerComponentConfig>): IData => {
    const value$ = node.inputs.get$('value');
    const $value = node.outputs.$set('value');

    const cssHexRGBColor$ = map$$(value$, rgb_to_css_rgb_hex_color);
    const $cssHexRGBColor = $$map($value, css_rgb_hex_color_to_rgb);

    node.setReactiveStyleProperty('--widget-color-picker-color', cssHexRGBColor$);

    const inputValue$ = cssHexRGBColor$;

    const $onInputChange = $$map($cssHexRGBColor, (event: Event): string => {
      return (event.target as HTMLInputElement).value;
    });

    return {
      inputValue$,
      $onInputChange,
    };
  },
});
