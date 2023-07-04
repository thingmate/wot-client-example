import { IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  createComponent,
  VirtualCustomElementNode,
} from '@lirx/dom';
import { IGenericThing, isSmartPlugThing, isSmartLightThing } from '@thingmate/wot-scripting-api';
import { SmartLightComponent } from '../smart-light/smart-light.component';
import { SmartPlugComponent } from '../smart-plug/smart-plug.component';

// @ts-ignore
import html from './generic-thing.component.html?raw';
// @ts-ignore
import style from './generic-thing.component.scss?inline';

/**
 * COMPONENT: 'app-generic-thing'
 **/

type IGenericThingType =
  | 'plug'
  | 'light'
  | 'unknown'
  ;

interface IData {
  readonly thing$: IObservable<IGenericThing>;
  readonly type$: IObservable<IGenericThingType>;
}

interface IGenericThingComponentConfig {
  element: HTMLElement;
  inputs: [
    ['thing', IGenericThing],
  ],
  data: IData;
}

export const GenericThingComponent = createComponent<IGenericThingComponentConfig>({
  name: 'app-generic-thing',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      SmartPlugComponent,
      SmartLightComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<IGenericThingComponentConfig>): IData => {
    const thing$ = node.inputs.get$('thing');

    const type$ = map$$(thing$, (thing: IGenericThing): IGenericThingType => {
      if (isSmartPlugThing(thing)) {
        return 'plug';
      } else if (isSmartLightThing(thing)) {
        return 'light';
      } else {
        return 'unknown';
      }
    });

    return {
      thing$,
      type$,
    };
  },
});
