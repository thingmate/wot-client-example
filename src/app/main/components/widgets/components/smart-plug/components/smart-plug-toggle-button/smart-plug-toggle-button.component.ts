import {
  IDefaultNotificationsUnion,
  IMapFilterMapFunctionReturn,
  IObservable,
  IObserver,
  let$$,
  MAP_FILTER_DISCARD,
  mapFilter$$$,
  mapObservableToObserver,
  pipe$$,
  shareRL$$$,
  switchMap$$$,
} from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { IconPowerComponent } from '@lirx/mdi';
import { IConsumedThingProperty, ISmartPlugState } from '@thingmate/wot-scripting-api';
import { observeConsumedThingProperty } from '../../../../../../../../misc/observe-consumed-thing-property';
import {
  IconToggleButtonWithLoaderComponent,
} from '../../../parts/icon-button/built-in/icon-toggle-button/built-in/icon-toggle-button-with-loader/icon-toggle-button-with-loader.component';

// @ts-ignore
import html from './smart-plug-toggle-button.component.html?raw';
// @ts-ignore
import style from './smart-plug-toggle-button.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug-toggle-button'
 **/

export type ISmartPlugStateConsumedThingProperty = IConsumedThingProperty<string, ISmartPlugState>;

interface IData {
  readonly active$: IObservable<boolean>;
  readonly $onClickOnOffToggleButton: IObserver<any>;
}

interface ISmartPlugToggleButtonComponentConfig {
  element: HTMLElement;
  inputs: [
    ['property', ISmartPlugStateConsumedThingProperty],
  ],
  data: IData;
}

export const SmartPlugToggleButtonComponent = createComponent<ISmartPlugToggleButtonComponentConfig>({
  name: 'app-smart-plug-toggle-button',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      IconToggleButtonWithLoaderComponent,
      IconPowerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['property'],
  ],
  init: (node: VirtualCustomElementNode<ISmartPlugToggleButtonComponentConfig>): IData => {
    const property$ = node.inputs.get$('property');

    const active$ = pipe$$(property$, [
      switchMap$$$<ISmartPlugStateConsumedThingProperty, IDefaultNotificationsUnion<ISmartPlugState>>((property: ISmartPlugStateConsumedThingProperty): IObservable<IDefaultNotificationsUnion<ISmartPlugState>> => {
        return observeConsumedThingProperty(property);
      }),
      mapFilter$$$<IDefaultNotificationsUnion<ISmartPlugState>, boolean>((notification: IDefaultNotificationsUnion<ISmartPlugState>): IMapFilterMapFunctionReturn<boolean> => {
        return (notification.name === 'next')
          ? (notification.value === 'on')
          : MAP_FILTER_DISCARD;
      }),
      shareRL$$$<boolean>(),
    ]);

    const [$loading, loading$, isLoading] = let$$<boolean>(false);

    const [$onClickOnOffToggleButton] = mapObservableToObserver(
      node.onConnected$(property$),
      (property: ISmartPlugStateConsumedThingProperty): IObserver<any> => {
        return (): void => {
          if (!isLoading()) {
            $loading(true);
            active$((active: boolean) => {
              property.write(active ? 'off' : 'on')
                .finally(() => {
                  $loading(false);
                });
            });
          }
        };
      },
    );

    node.setReactiveClass('loading', loading$);

    return {
      active$,
      $onClickOnOffToggleButton,
    };
  },
});
