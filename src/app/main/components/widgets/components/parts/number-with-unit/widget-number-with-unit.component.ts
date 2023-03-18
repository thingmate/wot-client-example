import { IObservable } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { setReactiveWidthAndHeightCSSVariables } from '@lirx/dom-material';

// @ts-ignore
import html from './widget-number-with-unit.component.html?raw';
// @ts-ignore
import style from './widget-number-with-unit.component.scss?inline';

/**
 * COMPONENT: 'app-widget-number-with-unit'
 **/

interface IData {
  readonly value$: IObservable<number | string>;
  readonly unit$: IObservable<string>;
}

interface IWidgetHeaderComponentConfig {
  element: HTMLElement;
  inputs: [
    ['value', number | string],
    ['unit', string],
  ],
  data: IData;
}

export const WidgetNumberWithUnitComponent = createComponent<IWidgetHeaderComponentConfig>({
  name: 'app-widget-number-with-unit',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['value', '-'],
    ['unit'],
  ],
  init: (node: VirtualCustomElementNode<IWidgetHeaderComponentConfig>): IData => {
    setReactiveWidthAndHeightCSSVariables(node);

    const value$ = node.inputs.get$('value');
    const unit$ = node.inputs.get$('unit');

    return {
      value$,
      unit$,
    };
  },
});
