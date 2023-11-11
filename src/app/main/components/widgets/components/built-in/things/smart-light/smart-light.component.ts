import { IObservable, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component, VirtualComponentNode, input, Input } from '@lirx/dom';
import { MatGridItemComponent } from '@lirx/dom-material';
import { IconLightbulbOutlineComponent } from '@lirx/mdi';
import { IColorThingProperty, IOnOffThingProperty, ISmartLightThing } from '@thingmate/wot-scripting-api';
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

export interface ISmartLightComponentData {
  readonly thing: Input<ISmartLightThing>;
}

interface ITemplateData {
  readonly thing$: IObservable<ISmartLightThing>;
  readonly onoffProperty$: IObservable<IOnOffThingProperty>;
  readonly colorProperty$: IObservable<IColorThingProperty>;
}

export const SmartLightComponent = new Component<HTMLElement, ISmartLightComponentData, ITemplateData>({
  name: 'app-smart-light',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      ThingBaseComponent,
      MatGridItemComponent,
      IconLightbulbOutlineComponent,
      ThingToggleOnOffStateButtonComponent,
      ThingColorPickerRGBCWComponent,
      ThingColorPickerRgbOrCctComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): ISmartLightComponentData => {
    return {
      thing: input<ISmartLightThing>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, ISmartLightComponentData>): ITemplateData => {
    const thing$ = node.input$('thing');

    const onoffProperty$ = map$$(thing$, (thing: ISmartLightThing): IOnOffThingProperty => {
      return thing.properties.onoff;
    });

    const colorProperty$ = map$$(thing$, (thing: ISmartLightThing): IColorThingProperty => {
      return thing.properties.color;
    });

    return {
      thing$,
      onoffProperty$,
      colorProperty$,
    };
  },
});
