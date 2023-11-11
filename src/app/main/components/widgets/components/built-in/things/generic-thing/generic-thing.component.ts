import { IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  Input,
  input,
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

export interface IGenericThingComponentData {
  readonly thing: Input<IGenericThing>;
}

type IGenericThingType =
  | 'plug'
  | 'light'
  | 'unknown'
  ;

interface ITemplateData {
  readonly thing$: IObservable<IGenericThing>;
  readonly type$: IObservable<IGenericThingType>;
}

export const GenericThingComponent = new Component<HTMLElement, IGenericThingComponentData, object>({
  name: 'app-generic-thing',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      SmartPlugComponent,
      SmartLightComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IGenericThingComponentData => {
    return {
      thing: input<IGenericThing>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IGenericThingComponentData>): ITemplateData => {
    const thing$ = node.input$('thing');

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
