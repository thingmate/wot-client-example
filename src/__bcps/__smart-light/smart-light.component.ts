import { function$$, IObservable, IObserver, let$$, single } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { IconLightbulbComponent, IconLightbulbOutlineComponent, IconPowerComponent, IconPowerSocketDeComponent } from '@lirx/mdi';
import { WidgetTemplateComponent } from '../widget-template/widget-template.component';

// @ts-ignore
import html from './smart-light.component.html?raw';
// @ts-ignore
import style from './smart-light.component.scss?inline';

/**
 * COMPONENT: 'app-smart-light'
 **/

interface IData {
  readonly $onClickOnOffToggleButton: IObserver<any>;
  readonly consumption$: IObservable<number>;
}

interface ISmartPlugComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const SmartLightComponent = createComponent<ISmartPlugComponentConfig>({
  name: 'app-smart-light',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetTemplateComponent,
      IconLightbulbOutlineComponent,
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
