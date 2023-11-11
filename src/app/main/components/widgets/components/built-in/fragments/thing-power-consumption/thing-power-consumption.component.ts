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
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component, input, Input, VirtualComponentNode } from '@lirx/dom';
import { IPowerConsumptionThingProperty, IPowerConsumption } from '@thingmate/wot-scripting-api';
import { observeThingProperty } from '../../../../../../../../misc/observe-thing-property';
import {
  WidgetNumberWithSiUnitComponent,
} from '../../../fragments/widget-number-with-unit/built-in/widget-number-with-si-unit/widget-number-with-si-unit.component';

// @ts-ignore
import html from './thing-power-consumption.component.html?raw';
// @ts-ignore
import style from './thing-power-consumption.component.scss?inline';

/**
 * COMPONENT: 'app-thing-power-consumption'
 **/

export interface IThingPowerConsumptionComponentData {
  readonly property: Input<IPowerConsumptionThingProperty>;
}

interface ITemplateData {
  readonly power$: IObservable<number>;
}

export const ThingPowerConsumptionComponent = new Component<HTMLElement, IThingPowerConsumptionComponentData, ITemplateData>({
  name: 'app-thing-power-consumption',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      WidgetNumberWithSiUnitComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IThingPowerConsumptionComponentData => {
    return {
      property: input<IPowerConsumptionThingProperty>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IThingPowerConsumptionComponentData>): ITemplateData => {
    const property$ = node.input$('property');

    const power$ = pipe$$(property$, [
      switchMap$$$<IPowerConsumptionThingProperty, IDefaultNotificationsUnion<IPowerConsumption>>((property: IPowerConsumptionThingProperty): IObservable<IDefaultNotificationsUnion<IPowerConsumption>> => {
        return observeThingProperty(property, 10e3);
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
