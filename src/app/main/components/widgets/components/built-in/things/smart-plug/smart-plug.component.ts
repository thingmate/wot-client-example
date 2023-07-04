import { IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  createComponent,
  VirtualCustomElementNode,
} from '@lirx/dom';
import { MatGridItemComponent } from '@lirx/dom-material';
import { IconPowerSocketDeComponent } from '@lirx/mdi';
import { IOnOffThingProperty, IPowerConsumptionThingProperty, ISmartPlugThing } from '@thingmate/wot-scripting-api';
import { ThingBaseComponent } from '../../fragments/thing-base/thing-base.component';
import { ThingPowerConsumptionComponent } from '../../fragments/thing-power-consumption/thing-power-consumption.component';
import {
  ThingToggleOnOffStateButtonComponent,
} from '../../fragments/thing-toggle-on-off-state-button/thing-toggle-on-off-state-button.component';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

interface IData {
  readonly thing$: IObservable<ISmartPlugThing>;
  readonly onoffProperty$: IObservable<IOnOffThingProperty>;
  readonly consumptionProperty$: IObservable<IPowerConsumptionThingProperty>;
}

interface ISmartPlugComponentConfig {
  element: HTMLElement;
  inputs: [
    ['thing', ISmartPlugThing],
  ],
  data: IData;
}

export const SmartPlugComponent = createComponent<ISmartPlugComponentConfig>({
  name: 'app-smart-plug',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      ThingBaseComponent,
      MatGridItemComponent,
      IconPowerSocketDeComponent,
      ThingToggleOnOffStateButtonComponent,
      ThingPowerConsumptionComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<ISmartPlugComponentConfig>): IData => {
    const thing$ = node.inputs.get$('thing');

    const onoffProperty$ = map$$(thing$, (thing: ISmartPlugThing): IOnOffThingProperty => {
      return thing.properties.onoff;
    });

    const consumptionProperty$ = map$$(thing$, (thing: ISmartPlugThing): IPowerConsumptionThingProperty => {
      return thing.properties.consumption;
    });

    return {
      thing$,
      onoffProperty$,
      consumptionProperty$,
    };
  },
});
