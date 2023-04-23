import {
  IDefaultNotificationsUnion,
  IMapFilterMapFunctionReturn,
  IObservable,
  MAP_FILTER_DISCARD,
  mapFilter$$$,
  pipe$$,
  shareRL$$$,
  switchMap$$$,
} from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { ISmartPlugConsumption, IThingProperty } from '@thingmate/wot-scripting-api';
import { observeThingProperty } from '../../../../../../../../../../misc/observe-thing-property';
import { WidgetNumberWithUnitComponent } from '../../../../number-with-unit/widget-number-with-unit.component';

// @ts-ignore
import html from './smart-plug-power-consumption.component.html?raw';
// @ts-ignore
import style from './smart-plug-power-consumption.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug-power-consumption'
 **/

export type ISmartPlugConsumptionThingProperty = IThingProperty<ISmartPlugConsumption>;

interface IData {
  readonly power$: IObservable<number>;
}

interface ISmartPlugPowerConsumptionComponentConfig {
  element: HTMLElement;
  inputs: [
    ['property', ISmartPlugConsumptionThingProperty],
  ],
  data: IData;
}

export const SmartPlugPowerConsumptionComponent = createComponent<ISmartPlugPowerConsumptionComponentConfig>({
  name: 'app-smart-plug-power-consumption',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetNumberWithUnitComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['property'],
  ],
  init: (node: VirtualCustomElementNode<ISmartPlugPowerConsumptionComponentConfig>): IData => {
    const property$ = node.inputs.get$('property');

    const power$ = pipe$$(property$, [
      switchMap$$$<ISmartPlugConsumptionThingProperty, IDefaultNotificationsUnion<ISmartPlugConsumption>>((property: ISmartPlugConsumptionThingProperty): IObservable<IDefaultNotificationsUnion<ISmartPlugConsumption>> => {
        return observeThingProperty(property);
      }),
      mapFilter$$$<IDefaultNotificationsUnion<ISmartPlugConsumption>, number>((notification: IDefaultNotificationsUnion<ISmartPlugConsumption>): IMapFilterMapFunctionReturn<number> => {
        return (notification.name === 'next')
          ? notification.value.power
          : MAP_FILTER_DISCARD;
      }),
      shareRL$$$<number>(),
    ]);

    return {
      power$,
    };
  },
});
