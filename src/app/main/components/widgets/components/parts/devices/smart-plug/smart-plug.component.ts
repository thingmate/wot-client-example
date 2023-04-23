import { IObservable, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatGridComponent, MatGridItemComponent } from '@lirx/dom-material';
import { IconPowerSocketDeComponent } from '@lirx/mdi';
import { ISmartPlugThing } from '@thingmate/wot-scripting-api';
import { WidgetHeaderComponent } from '../../header/widget-header.component';
import {
  ISmartPlugConsumptionThingProperty,
  SmartPlugPowerConsumptionComponent,
} from './components/smart-plug-power-consumption/smart-plug-power-consumption.component';
import {
  ISmartPlugStateThingProperty,
  SmartPlugToggleButtonComponent,
} from './components/smart-plug-toggle-button/smart-plug-toggle-button.component';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

interface IData {
  readonly title$: IObservable<string>;
  readonly stateProperty$: IObservable<ISmartPlugStateThingProperty>;
  readonly consumptionProperty$: IObservable<ISmartPlugConsumptionThingProperty>;
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
      IconPowerSocketDeComponent,
      SmartPlugToggleButtonComponent,
      SmartPlugPowerConsumptionComponent,
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

    const stateProperty$ = map$$(thing$, (thing: ISmartPlugThing): ISmartPlugStateThingProperty => {
      return thing.getProperty('state');
    });

    const consumptionProperty$ = map$$(thing$, (thing: ISmartPlugThing): ISmartPlugConsumptionThingProperty => {
      return thing.getProperty('consumption');
    });

    return {
      title$,
      stateProperty$,
      consumptionProperty$,
    };
  },
});
