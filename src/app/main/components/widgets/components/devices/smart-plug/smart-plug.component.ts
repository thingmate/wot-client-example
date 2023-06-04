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
import { WidgetHeaderIconComponent } from '../../fragments/header/fragments/widget-header-icon/widget-header-icon.component';
import { WidgetHeaderTitleComponent } from '../../fragments/header/fragments/widget-header-title/widget-header-title.component';
import { WidgetHeaderComponent } from '../../fragments/header/widget-header.component';
import { ThingPowerConsumptionComponent } from '../parts/thing-power-consumption/thing-power-consumption.component';
import { ThingToggleOnOffStateButtonComponent } from '../parts/thing-toggle-on-off-state-button/thing-toggle-on-off-state-button.component';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

interface IData {
  readonly title$: IObservable<string>;
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
      MatGridComponent,
      MatGridItemComponent,
      WidgetHeaderComponent,
      WidgetHeaderTitleComponent,
      WidgetHeaderIconComponent,
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

    const title$ = map$$(thing$, (thing: ISmartPlugThing): string => {
      return 'TODO';
      // return thing.getDescription().title;
    });

    const stateProperty$ = map$$(thing$, (thing: ISmartPlugThing): IOnOffStateThingProperty => {
      return thing.getProperty('state');
    });

    const consumptionProperty$ = map$$(thing$, (thing: ISmartPlugThing): IPowerConsumptionThingProperty => {
      return thing.getProperty('consumption');
    });

    return {
      title$,
      stateProperty$,
      consumptionProperty$,
    };
  },
});
