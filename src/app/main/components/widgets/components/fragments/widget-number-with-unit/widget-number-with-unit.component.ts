import { IObservable } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

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

interface IWidgetNumberWithUnitComponentConfig {
  element: HTMLElement;
  inputs: [
    ['value', number | string],
    ['unit', string],
  ],
  data: IData;
}

export const WidgetNumberWithUnitComponent = createComponent<IWidgetNumberWithUnitComponentConfig>({
  name: 'app-widget-number-with-unit',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['value', '-'],
    ['unit'],
  ],
  init: (node: VirtualCustomElementNode<IWidgetNumberWithUnitComponentConfig>): IData => {
    cssVarsSizeModifierFunction(node);

    const value$ = node.inputs.get$('value');
    const unit$ = node.inputs.get$('unit');

    return {
      value$,
      unit$,
    };
  },
});
