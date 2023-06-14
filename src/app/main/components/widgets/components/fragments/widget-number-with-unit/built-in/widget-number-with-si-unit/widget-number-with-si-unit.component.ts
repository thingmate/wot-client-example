import { function$$, IObservable, shareRL$$, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { WidgetNumberWithUnitComponent } from '../../widget-number-with-unit.component';
import { formatSi, formatValueAndSiUnit } from './functions/get-si-prefix';

// @ts-ignore
import html from './widget-number-with-si-unit.component.html?raw';
// @ts-ignore
import style from './widget-number-with-si-unit.component.scss?inline';

/**
 * COMPONENT: 'app-widget-number-with-si-unit'
 **/

interface IData {
  readonly value$: IObservable<number | string>;
  readonly unit$: IObservable<string>;
}

interface IWidgetNumberWithSiUnitComponentConfig {
  element: HTMLElement;
  inputs: [
    ['value', number],
    ['unit', string],
    ['precision', number],
  ],
  data: IData;
}

export const WidgetNumberWithSiUnitComponent = createComponent<IWidgetNumberWithSiUnitComponentConfig>({
  name: 'app-widget-number-with-si-unit',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetNumberWithUnitComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['value'],
    ['unit'],
    ['precision', 3],
  ],
  init: (node: VirtualCustomElementNode<IWidgetNumberWithSiUnitComponentConfig>): IData => {
    const value$ = node.inputs.get$('value');
    const unit$ = node.inputs.get$('unit');
    const precision$ = node.inputs.get$('precision');

    const valueAndUnit$ = shareRL$$(
      function$$(
        [value$, unit$, precision$],
        formatValueAndSiUnit,
      ),
    );

    const _value$ = map$$(valueAndUnit$, _ => _[0]);
    const _unit$ = map$$(valueAndUnit$, _ => _[1]);

    return {
      value$: _value$,
      unit$: _unit$,
    };
  },
});
