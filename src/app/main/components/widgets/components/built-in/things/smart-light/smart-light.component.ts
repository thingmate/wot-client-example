import { IObservable, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatGridItemComponent } from '@lirx/dom-material';
import { IconLightbulbOutlineComponent } from '@lirx/mdi';
import { IColorThingProperty, IOnOffStateThingProperty, ISmartLightThing } from '@thingmate/wot-scripting-api';
import { ThingBaseComponent } from '../../fragments/thing-base/thing-base.component';
import { ThingColorPickerRgbOrCctComponent } from '../../fragments/thing-color-picker/rgb-or-cct/thing-color-picker-rgb-or-cct.component';
import { ThingColorPickerRGBCWComponent } from '../../fragments/thing-color-picker/rgbcw/thing-color-picker-rgbcw.component';
import {
  ThingToggleOnOffStateButtonComponent,
} from '../../fragments/thing-toggle-on-off-state-button/thing-toggle-on-off-state-button.component';

// @ts-ignore
import html from './smart-light.component.html?raw';
// @ts-ignore
import style from './smart-light.component.scss?inline';

/**
 * COMPONENT: 'app-smart-light'
 **/

interface IData {
  readonly thing$: IObservable<ISmartLightThing>;
  readonly stateProperty$: IObservable<IOnOffStateThingProperty>;
  readonly colorProperty$: IObservable<IColorThingProperty>;
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
      ThingBaseComponent,
      MatGridItemComponent,
      IconLightbulbOutlineComponent,
      ThingToggleOnOffStateButtonComponent,
      ThingColorPickerRGBCWComponent,
      ThingColorPickerRgbOrCctComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<ISmartLightComponentConfig>): IData => {
    const thing$ = node.inputs.get$('thing');

    const stateProperty$ = map$$(thing$, (thing: ISmartLightThing): IOnOffStateThingProperty => {
      return thing.getProperty('state');
    });

    const colorProperty$ = map$$(thing$, (thing: ISmartLightThing): IColorThingProperty => {
      return thing.getProperty('color');
    });

    return {
      thing$,
      stateProperty$,
      colorProperty$,
    };
  },
});
