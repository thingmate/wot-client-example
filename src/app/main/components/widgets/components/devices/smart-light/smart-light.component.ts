import { IObservable, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatGridComponent, MatGridItemComponent } from '@lirx/dom-material';
import { IconLightbulbOutlineComponent } from '@lirx/mdi';
import { IOnOffStateThingProperty, ISmartLightThing } from '@thingmate/wot-scripting-api';
import { WidgetColorPickerComponent } from '../../fragments/color-picker/widget-color-picker.component';
import { WidgetHeaderIconComponent } from '../../fragments/header/fragments/widget-header-icon/widget-header-icon.component';
import { WidgetHeaderTitleComponent } from '../../fragments/header/fragments/widget-header-title/widget-header-title.component';
import { WidgetHeaderComponent } from '../../fragments/header/widget-header.component';
import { ThingPowerConsumptionComponent } from '../parts/thing-power-consumption/thing-power-consumption.component';
import { ThingToggleOnOffStateButtonComponent } from '../parts/thing-toggle-on-off-state-button/thing-toggle-on-off-state-button.component';

// @ts-ignore
import html from './smart-light.component.html?raw';
// @ts-ignore
import style from './smart-light.component.scss?inline';

/**
 * COMPONENT: 'app-smart-light'
 **/

interface IData {
  readonly title$: IObservable<string>;
  readonly stateProperty$: IObservable<IOnOffStateThingProperty>;
}

interface ISmartLightComponentConfig {
  element: HTMLElement;
  inputs: [
    ['thing', ISmartLightThing],
  ],
  data: IData;
}

export const SmartLightComponent = createComponent<ISmartLightComponentConfig>({
  name: 'app-smart-light',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatGridComponent,
      MatGridItemComponent,
      WidgetHeaderComponent,
      WidgetHeaderTitleComponent,
      WidgetHeaderIconComponent,
      IconLightbulbOutlineComponent,
      ThingToggleOnOffStateButtonComponent,
      ThingPowerConsumptionComponent,
      WidgetColorPickerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<ISmartLightComponentConfig>): IData => {
    const thing$ = node.inputs.get$('thing');

    const title$ = map$$(thing$, (thing: ISmartLightThing): string => {
      return 'TODO';
      // return thing.getDescription().title;
    });

    const stateProperty$ = map$$(thing$, (thing: ISmartLightThing): IOnOffStateThingProperty => {
      return thing.getProperty('state');
    });

    return {
      title$,
      stateProperty$,
    };
  },
});
