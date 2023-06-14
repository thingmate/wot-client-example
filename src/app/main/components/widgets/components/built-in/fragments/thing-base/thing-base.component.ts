import {
  distinct$$$,
  IDefaultNotificationsUnion,
  IObservable,
  map$$,
  notificationsToImmediate$$$,
  pipe$$,
  shareRL$$$,
  switchMap$$$,
} from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatGridComponent, MatGridItemComponent } from '@lirx/dom-material';
import { IGenericThing, IOnlineThingProperty, ISmartLightThing } from '@thingmate/wot-scripting-api';
import { fromPushSourceWithBackPressure } from '../../../../../../../../misc/from-push-source-with-back-pressure';
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

interface IData {
  readonly title$: IObservable<string>;
  readonly isOnline$: IObservable<boolean>;
}

interface IThingBaseComponentConfig {
  element: HTMLElement;
  inputs: [
    ['thing', IGenericThing],
  ],
  data: IData;
}

export const ThingBaseComponent = createComponent<IThingBaseComponentConfig>({
  name: 'app-thing-base',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatGridComponent,
      MatGridItemComponent,
      WidgetHeaderComponent,
      WidgetHeaderTitleComponent,
      WidgetHeaderIconComponent,
      WidgetOfflineComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<IThingBaseComponentConfig>): IData => {
    const thing$ = node.inputs.get$('thing');

    const title$ = map$$(thing$, (thing: ISmartLightThing): string => {
      return thing.description.title ?? 'Unknown device';
    });

    const onlineProperty$ = map$$(thing$, (thing: ISmartLightThing): IOnlineThingProperty => {
      return thing.getProperty('online');
    });

    const isOnline$ = pipe$$(onlineProperty$, [
      switchMap$$$<IOnlineThingProperty, IDefaultNotificationsUnion<boolean>>((property: IOnlineThingProperty): IObservable<IDefaultNotificationsUnion<boolean>> => {
        return fromPushSourceWithBackPressure(property.observe());
      }),
      notificationsToImmediate$$$<boolean>(),
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
