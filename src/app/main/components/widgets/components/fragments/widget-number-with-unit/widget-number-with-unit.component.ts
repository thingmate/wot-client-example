import { IObservable } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  Input,
  input,
} from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import html from './widget-number-with-unit.component.html?raw';
// @ts-ignore
import style from './widget-number-with-unit.component.scss?inline';

/**
 * COMPONENT: 'app-widget-number-with-unit'
 **/

export interface IWidgetNumberWithUnitComponentData {
  readonly value: Input<number | string>;
  readonly unit: Input<string>;
}

interface ITemplateData {
  readonly value$: IObservable<number | string>;
  readonly unit$: IObservable<string>;
}

export const WidgetNumberWithUnitComponent = new Component<HTMLElement, IWidgetNumberWithUnitComponentData, ITemplateData>({
  name: 'app-widget-number-with-unit',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IWidgetNumberWithUnitComponentData => {
    return {
      value: input<number | string>('-'),
      unit: input<string>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IWidgetNumberWithUnitComponentData>): ITemplateData => {
    cssVarsSizeModifierFunction(node);

    const value$ = node.input$('value');
    const unit$ = node.input$('unit');

    return {
      value$,
      unit$,
    };
  },
});
