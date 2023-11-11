import {
  $log,
  distinct$$$,
  IDefaultNotificationsUnion,
  IObservable,
  map$$,
  notificationsToImmediate$$$,
  pipe$$,
  shareRL$$$,
  switchMap$$$,
} from '@lirx/core';
import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  Input,
  input,
} from '@lirx/dom';
import { MatGridComponent, MatGridItemComponent } from '@lirx/dom-material';
import { IGenericThing, IOnlineThingProperty, ISmartLightThing } from '@thingmate/wot-scripting-api';
import { observeThingProperty } from '../../../../../../../../misc/observe-thing-property';
import { WidgetHeaderIconComponent } from '../../../fragments/widget-header/fragments/widget-header-icon/widget-header-icon.component';
import { WidgetHeaderTitleComponent } from '../../../fragments/widget-header/fragments/widget-header-title/widget-header-title.component';
import { WidgetHeaderComponent } from '../../../fragments/widget-header/widget-header.component';
import { WidgetOfflineComponent } from '../../../fragments/widget-offline/widget-offline.component';

// @ts-ignore
import html from './thing-base.component.html?raw';
// @ts-ignore
import style from './thing-base.component.scss?inline';

/**
 * COMPONENT: 'app-thing-base'
 **/

export interface IThingBaseComponentData {
  readonly thing: Input<IGenericThing>;
}

interface ITemplateData {
  readonly title$: IObservable<string>;
  readonly isOnline$: IObservable<boolean>;
}

export const ThingBaseComponent = new Component<HTMLElement, IThingBaseComponentData, ITemplateData>({
  name: 'app-thing-base',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      MatGridComponent,
      MatGridItemComponent,
      WidgetHeaderComponent,
      WidgetHeaderTitleComponent,
      WidgetHeaderIconComponent,
      WidgetOfflineComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IThingBaseComponentData => {
    return {
      thing: input<IGenericThing>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IThingBaseComponentData>): ITemplateData => {
    const thing$ = node.input$('thing');

    const title$ = map$$(thing$, (thing: ISmartLightThing): string => {
      return thing.description.title;
    });

    const onlineProperty$ = map$$(thing$, (thing: ISmartLightThing): IOnlineThingProperty => {
      return thing.properties.online;
    });

    const isOnline$ = pipe$$(onlineProperty$, [
      switchMap$$$<IOnlineThingProperty, IDefaultNotificationsUnion<boolean>>((property: IOnlineThingProperty): IObservable<IDefaultNotificationsUnion<boolean>> => {
        return observeThingProperty(property, 10e3);
      }),
      notificationsToImmediate$$$<boolean>((error: unknown): void => {
        console.error(error);
      }),
      distinct$$$<boolean>(),
      shareRL$$$<boolean>(),
    ]);

    node.setReactiveClass('online', isOnline$);

    return {
      title$,
      isOnline$,
    };
  },
});
