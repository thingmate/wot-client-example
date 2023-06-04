import { css_rgb_hex_color_to_rgb, css_rgb_hex_color_to_rgba, IRGBColor, rgb_to_css_rgb_hex_color } from '@lifaon/color';
import { $$map, IObservable, IObserver, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { setReactiveWidthAndHeightCSSVariables } from '@lirx/dom-material';

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
    ['color', IRGBColor],
  ];
  outputs: [
    ['color', IRGBColor],
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
    ['color'],
  ],
  outputs: [
    ['color'],
  ],
  init: (node: VirtualCustomElementNode<IWidgetColorPickerComponentConfig>): IData => {
    setReactiveWidthAndHeightCSSVariables(node);

    const color$ = node.inputs.get$('color');
    const $color = node.outputs.$set('color');

    const cssHexRGBColor$ = map$$(color$, rgb_to_css_rgb_hex_color);
    const $cssHexRGBColor = $$map($color, css_rgb_hex_color_to_rgb);

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
