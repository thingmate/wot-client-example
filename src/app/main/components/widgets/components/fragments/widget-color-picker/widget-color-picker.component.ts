import { css_rgb_hex_color_to_rgb, IRGBColor, rgb_to_css_rgb_hex_color } from '@lifaon/color';
import { $$map, IObservable, IObserver, map$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  input,
  Input, Output, output,
} from '@lirx/dom';

// @ts-ignore
import html from './widget-color-picker.component.html?raw';
// @ts-ignore
import style from './widget-color-picker.component.scss?inline';

/**
 * COMPONENT: 'app-widget-color-picker'
 **/

export interface IWidgetColorPickerComponentData {
  readonly value: Input<IRGBColor>;
  readonly valueChange: Output<IRGBColor>;
}

interface ITemplateData {
  readonly inputValue$: IObservable<string>;
  readonly $onInputChange: IObserver<Event>;
}

export const WidgetColorPickerComponent = new Component<HTMLElement, IWidgetColorPickerComponentData, ITemplateData>({
  name: 'app-widget-color-picker',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IWidgetColorPickerComponentData => {
    return {
      value: input<IRGBColor>(),
      valueChange: output<IRGBColor>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IWidgetColorPickerComponentData>): ITemplateData => {
    const value$ = node.input$('value');
    const $value = node.$output('valueChange');

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
