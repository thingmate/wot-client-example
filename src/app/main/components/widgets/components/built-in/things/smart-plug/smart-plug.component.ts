import { IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  input,
  Input,
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

export interface ISmartPlugComponentData {
  readonly thing: Input<ISmartPlugThing>;
}

interface ITemplateData {
  readonly thing$: IObservable<ISmartPlugThing>;
  readonly onoffProperty$: IObservable<IOnOffThingProperty>;
  readonly consumptionProperty$: IObservable<IPowerConsumptionThingProperty>;
}

export const SmartPlugComponent = new Component<HTMLElement, ISmartPlugComponentData, ITemplateData>({
  name: 'app-smart-plug',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      ThingBaseComponent,
      MatGridItemComponent,
      IconPowerSocketDeComponent,
      ThingToggleOnOffStateButtonComponent,
      ThingPowerConsumptionComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): ISmartPlugComponentData => {
    return {
      thing: input<ISmartPlugThing>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, ISmartPlugComponentData>): ITemplateData => {
    const thing$ = node.input$('thing');

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
