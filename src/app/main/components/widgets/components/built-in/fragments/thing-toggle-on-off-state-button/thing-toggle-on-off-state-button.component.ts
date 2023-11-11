import { Abortable, AsyncTask, IAsyncTaskSuccessFunction } from '@lirx/async-task';
import {
  IDefaultNotificationsUnion,
  IMapFilterMapFunctionReturn,
  IObservable,
  IObserver,
  let$$,
  map$$,
  MAP_FILTER_DISCARD,
  mapFilter$$$,
  pipe$$,
  shareRL$$$,
  subscribeOnce,
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
import { IconPowerComponent } from '@lirx/mdi';
import { IOnOff, IOnOffThingProperty } from '@thingmate/wot-scripting-api';
import { observeThingProperty } from '../../../../../../../../misc/observe-thing-property';
import {
  IconToggleButtonWithLoaderComponent,
} from '../../../fragments/widget-icon-button/built-in/widget-icon-toggle-button/built-in/widget-icon-toggle-button-with-loader/icon-toggle-button-with-loader.component';
import { IUnsubscribe, futureUnsubscribe } from '@lirx/unsubscribe';

// @ts-ignore
import html from './thing-toggle-on-off-state-button.component.html?raw';
// @ts-ignore
import style from './thing-toggle-on-off-state-button.component.scss?inline';

/**
 * COMPONENT: 'thing-toggle-on-off-state-button'
 **/

export interface IThingToggleOnOffStateButtonComponentData {
  readonly property: Input<IOnOffThingProperty>;
}

interface ITemplateData {
  readonly active$: IObservable<boolean>;
  readonly loading$: IObservable<boolean>;
  readonly onClickOnOffToggleButton$: IObservable<IObserver<any>>;
}

export const ThingToggleOnOffStateButtonComponent = new Component<HTMLElement, IThingToggleOnOffStateButtonComponentData, ITemplateData>({
  name: 'app-thing-toggle-on-off-state-button',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      IconToggleButtonWithLoaderComponent,
      IconPowerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IThingToggleOnOffStateButtonComponentData => {
    return {
      property: input<IOnOffThingProperty>(),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IThingToggleOnOffStateButtonComponentData>): ITemplateData => {
    const property$ = node.input$('property');

    const active$ = pipe$$(property$, [
      switchMap$$$<IOnOffThingProperty, IDefaultNotificationsUnion<IOnOff>>((property: IOnOffThingProperty): IObservable<IDefaultNotificationsUnion<IOnOff>> => {
        return observeThingProperty(property, 10e3);
      }),
      mapFilter$$$<IDefaultNotificationsUnion<IOnOff>, boolean>((notification: IDefaultNotificationsUnion<IOnOff>): IMapFilterMapFunctionReturn<boolean> => {
        return (notification.name === 'next')
          ? (notification.value === 'on')
          : MAP_FILTER_DISCARD;
      }),
      shareRL$$$<boolean>(),
    ]);

    const readActiveState = (
      abortable: Abortable,
    ): AsyncTask<boolean> => {
      return new AsyncTask<boolean>((success: IAsyncTaskSuccessFunction<boolean>): void => {
        subscribeOnce(active$, success);
      }, abortable);
    };

    const awaitActiveState = (
      active: boolean,
      abortable: Abortable,
    ): AsyncTask<void> => {
      return new AsyncTask<void>((success: IAsyncTaskSuccessFunction<void>): void => {
        futureUnsubscribe((unsubscribe: IUnsubscribe) => {
          return active$((_active: boolean): void => {
            if (_active === active) {
              unsubscribe();
              success();
            }
          });
        });
      }, abortable);
    };

    const toggleActiveState = (
      property: IOnOffThingProperty,
    ): void => {
      if (!isLoading()) {
        $loading(true);
        readActiveState(Abortable.never)
          .successful((active: boolean, abortable: Abortable): AsyncTask<void> => {
            return property.write!(active ? 'off' : 'on', abortable)
              .successful((_, abortable: Abortable): AsyncTask<void> => {
                return awaitActiveState(!active, abortable);
              });
          })
          .finally(() => {
            $loading(false);
          });
      }
    };

    const [$loading, loading$, isLoading] = let$$<boolean>(false);

    const onClickOnOffToggleButton$ = map$$(property$, (property: IOnOffThingProperty): IObserver<any> => {
      return (): void => {
        if (!isLoading()) {
          toggleActiveState(property);
        }
      };
    });

    node.setReactiveClass('loading', loading$);

    return {
      active$,
      loading$,
      onClickOnOffToggleButton$,
    };
  },
});
