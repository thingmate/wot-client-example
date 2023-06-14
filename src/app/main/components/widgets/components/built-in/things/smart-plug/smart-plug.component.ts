import { IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  createComponent,
  createComponentFromCustomElement,
  VirtualCustomElementNode,
} from '@lirx/dom';
import { MatGridComponent, MatGridItemComponent } from '@lirx/dom-material';
import { IconPowerSocketDeComponent } from '@lirx/mdi';
import { IOnOffStateThingProperty, IPowerConsumptionThingProperty, ISmartPlugThing } from '@thingmate/wot-scripting-api';
import { WidgetHeaderIconComponent } from '../../../fragments/widget-header/fragments/widget-header-icon/widget-header-icon.component';
import { WidgetHeaderTitleComponent } from '../../../fragments/widget-header/fragments/widget-header-title/widget-header-title.component';
import { WidgetHeaderComponent } from '../../../fragments/widget-header/widget-header.component';
import { ThingBaseComponent } from '../../fragments/thing-base/thing-base.component';
import { ThingPowerConsumptionComponent } from '../../fragments/thing-power-consumption/thing-power-consumption.component';
import { ThingToggleOnOffStateButtonComponent } from '../../fragments/thing-toggle-on-off-state-button/thing-toggle-on-off-state-button.component';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

interface IData {
  readonly thing$: IObservable<ISmartPlugThing>;
  readonly stateProperty$: IObservable<IOnOffStateThingProperty>;
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

    const stateProperty$ = map$$(thing$, (thing: ISmartPlugThing): IOnOffStateThingProperty => {
      return thing.getProperty('state');
    });

    const consumptionProperty$ = map$$(thing$, (thing: ISmartPlugThing): IPowerConsumptionThingProperty => {
      return thing.getProperty('consumption');
    });

    return {
      thing$,
      stateProperty$,
      consumptionProperty$,
    };
  },
});
