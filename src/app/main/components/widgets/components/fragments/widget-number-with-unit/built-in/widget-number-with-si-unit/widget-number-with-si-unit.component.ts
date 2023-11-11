import { function$$, IObservable, shareRL$$, map$$, $log } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  input,
  Input,
} from '@lirx/dom';
import { WidgetNumberWithUnitComponent } from '../../widget-number-with-unit.component';
import { formatValueAndSiUnit } from './functions/get-si-prefix';

// @ts-ignore
import html from './widget-number-with-si-unit.component.html?raw';
// @ts-ignore
import style from './widget-number-with-si-unit.component.scss?inline';

/**
 * COMPONENT: 'app-widget-number-with-si-unit'
 **/

export interface IWidgetNumberWithSiUnitComponentData {
  readonly value: Input<number>;
  readonly unit: Input<string>;
  readonly precision: Input<number>;
}

interface ITemplateData {
  readonly value$: IObservable<number | string>;
  readonly unit$: IObservable<string>;
}

export const WidgetNumberWithSiUnitComponent = new Component<HTMLElement, IWidgetNumberWithSiUnitComponentData, ITemplateData>({
  name: 'app-widget-number-with-si-unit',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      WidgetNumberWithUnitComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IWidgetNumberWithSiUnitComponentData => {
    return {
      value: input<number>(),
      unit: input<string>(),
      precision: input<number>(3),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IWidgetNumberWithSiUnitComponentData>): ITemplateData => {
    const value$ = node.input$('value');
    const unit$ = node.input$('unit');
    const precision$ = node.input$('precision');

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
