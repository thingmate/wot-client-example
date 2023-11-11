import { $$map, function$$, IObservable, IObserver, toString$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  input,
  Input, Output, output,
} from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import html from './widget-range-picker.component.html?raw';
// @ts-ignore
import style from './widget-range-picker.component.scss?inline';

/**
 * COMPONENT: 'app-widget-range-picker'
 **/

export interface IWidgetRangePickerComponentData {
  readonly value: Input<number>;
  readonly valueChange: Output<number>;
  readonly min: Input<number>;
  readonly max: Input<number>;
  readonly step: Input<number>;
  readonly text: Input<string>;
}

interface ITemplateData {
  readonly min$: IObservable<number>;
  readonly max$: IObservable<number>;
  readonly step$: IObservable<number>;
  readonly text$: IObservable<string>;
  readonly inputValue$: IObservable<number>;
  readonly $onInputChange: IObserver<Event>;
}

export const WidgetRangePickerComponent = new Component<HTMLElement, IWidgetRangePickerComponentData, ITemplateData>({
  name: 'app-widget-range-picker',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IWidgetRangePickerComponentData => {
    return {
      value: input<number>(0.0),
      valueChange: output<number>(),
      min: input<number>(0),
      max: input<number>(1),
      step: input<number>(),
      text: input<string>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IWidgetRangePickerComponentData>): ITemplateData => {
    cssVarsSizeModifierFunction(node);

    const min$ = node.input$('min');
    const max$ = node.input$('max');
    const step$ = node.input$('step');
    const text$ = node.input$('text');

    /* VALUE */

    const value$ = node.input$('value');
    const $value = node.$output('valueChange');

    const inputValue$ = value$;

    const $onInputChange = $$map($value, (event: Event): number => {
      return (event.target as HTMLInputElement).valueAsNumber;
    });

    node.setEventListener('pointerdown', event => event.stopPropagation());

    const normalizedValue$ = function$$(
      [value$, min$, max$],
      (value: number, min: number, max: number) => {
        return (value - min) / (max - min);
      },
    );
    node.setReactiveStyleProperty('--widget-range-picker-value', toString$$(normalizedValue$));

    return {
      min$,
      max$,
      step$,
      text$,
      inputValue$,
      $onInputChange,
    };
  },
});
