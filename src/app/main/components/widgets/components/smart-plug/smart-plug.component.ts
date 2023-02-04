import { function$$, IObservable, IObserver, let$$, single } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { IconPowerComponent, IconPowerSocketDeComponent } from '@lirx/mdi';
import { WidgetTemplateComponent } from '../__shared/widget-template/widget-template.component';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

interface IData {
  readonly $onClickOnOffToggleButton: IObserver<any>;
  readonly consumption$: IObservable<number>;
}

interface ISmartPlugComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const SmartPlugComponent = createComponent<ISmartPlugComponentConfig>({
  name: 'app-smart-plug',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetTemplateComponent,
      IconPowerSocketDeComponent,
      IconPowerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<ISmartPlugComponentConfig>): IData => {
    const [$isOn, isOn$, isOn] = let$$<boolean>();
    const consumption$ = single(154);

    const $onClickOnOffToggleButton = () => {
      $isOn(!isOn());
    };

    const classNames$ = function$$(
      [isOn$],
      (isOn: boolean): Set<string> => {
        return new Set<string>([
          `state-${isOn ? 'on' : 'off'}`,
        ]);
      },
    );
    node.setReactiveClassNamesList(classNames$);

    return {
      $onClickOnOffToggleButton,
      consumption$,
    };
  },
});
