import { $$map, $log, function$$, IObservable, IObserver, toString$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import html from './widget-range-picker.component.html?raw';
// @ts-ignore
import style from './widget-range-picker.component.scss?inline';

/**
 * COMPONENT: 'app-widget-range-picker'
 **/

interface IData {
  readonly min$: IObservable<number>;
  readonly max$: IObservable<number>;
  readonly step$: IObservable<number>;
  readonly text$: IObservable<string>;
  readonly inputValue$: IObservable<number>;
  readonly $onInputChange: IObserver<Event>;
}

interface IWidgetRangePickerComponentConfig {
  element: HTMLElement;
  inputs: [
    ['value', number],
    ['min', number],
    ['max', number],
    ['step', number],
    ['text', string],
  ];
  outputs: [
    ['value', number],
  ];
  data: IData;
}

export const WidgetRangePickerComponent = createComponent<IWidgetRangePickerComponentConfig>({
  name: 'app-widget-range-picker',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['value', 0.0],
    ['min', 0],
    ['max', 1],
    ['step'],
    ['text'],
  ],
  outputs: [
    ['value'],
  ],
  init: (node: VirtualCustomElementNode<IWidgetRangePickerComponentConfig>): IData => {
    cssVarsSizeModifierFunction(node);

    const min$ = node.inputs.get$('min');
    const max$ = node.inputs.get$('max');
    const step$ = node.inputs.get$('step');
    const text$ = node.inputs.get$('text');

    /* VALUE */

    const value$ = node.inputs.get$('value');
    const $value = node.outputs.$set('value');

    const inputValue$ = value$;

    const $onInputChange = $$map($value, (event: Event): number => {
      return (event.target as HTMLInputElement).valueAsNumber;
    });

    node.setReactiveEventListener('pointerdown', event => event.stopPropagation());

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
