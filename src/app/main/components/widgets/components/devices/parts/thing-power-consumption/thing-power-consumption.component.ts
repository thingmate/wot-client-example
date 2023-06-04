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
import { IPowerConsumptionThingProperty, IPowerConsumption } from '@thingmate/wot-scripting-api';
import { observeThingProperty } from '../../../../../../../../misc/observe-thing-property';
import { WidgetNumberWithUnitComponent } from '../../../fragments/number-with-unit/widget-number-with-unit.component';

// @ts-ignore
import html from './thing-power-consumption.component.html?raw';
// @ts-ignore
import style from './thing-power-consumption.component.scss?inline';

/**
 * COMPONENT: 'app-thing-power-consumption'
 **/

interface IData {
  readonly power$: IObservable<number>;
}

interface IThingPowerConsumptionComponentConfig {
  element: HTMLElement;
  inputs: [
    ['property', IPowerConsumptionThingProperty],
  ],
  data: IData;
}

export const ThingPowerConsumptionComponent = createComponent<IThingPowerConsumptionComponentConfig>({
  name: 'app-thing-power-consumption',
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
  init: (node: VirtualCustomElementNode<IThingPowerConsumptionComponentConfig>): IData => {
    const property$ = node.inputs.get$('property');

    const power$ = pipe$$(property$, [
      switchMap$$$<IPowerConsumptionThingProperty, IDefaultNotificationsUnion<IPowerConsumption>>((property: IPowerConsumptionThingProperty): IObservable<IDefaultNotificationsUnion<IPowerConsumption>> => {
        return observeThingProperty(property);
      }),
      mapFilter$$$<IDefaultNotificationsUnion<IPowerConsumption>, number>((notification: IDefaultNotificationsUnion<IPowerConsumption>): IMapFilterMapFunctionReturn<number> => {
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
