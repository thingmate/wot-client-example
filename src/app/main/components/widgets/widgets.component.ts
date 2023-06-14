import { Abortable, AsyncTask } from '@lirx/async-task';
import { IObservable, let$$ } from '@lirx/core';
import { mergePushSourceWithBackPressure } from '@lirx/stream';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent } from '@lirx/dom';
import { MatColumnComponent, MatColumnItemComponent } from '@lirx/dom-material';
import { MerossThingDiscovery } from '@thingmate/vendor-meross';
import { TuyaThingDiscovery } from '@thingmate/vendor-tuya';
import { IGenericThing } from '@thingmate/wot-scripting-api';
import { MEROS_CONFIG } from '../../../../configs/meross-config.private';
import { TUYA_CONFIG } from '../../../../configs/tuya-config.private';
import { asyncFetchJSONWithoutCors } from '../../../../misc/get-cors-proxy-url';
import { openWebSocketMqttClientWithoutCors } from '../../../../misc/get-web-socket-proxy-url';
import { GenericThingComponent } from './components/built-in/things/generic-thing/generic-thing.component';
import { SmartLightComponent } from './components/built-in/things/smart-light/smart-light.component';
import { SmartPlugComponent } from './components/built-in/things/smart-plug/smart-plug.component';

// @ts-ignore
import html from './widgets.component.html?raw';
// @ts-ignore
import style from './widgets.component.scss?inline';

/**
 * COMPONENT: 'app-widgets'
 **/

interface IData {
  readonly things$: IObservable<readonly IGenericThing[]>;
}

interface IWidgetsComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const WidgetsComponent = createComponent<IWidgetsComponentConfig>({
  name: 'app-widgets',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatColumnComponent,
      MatColumnItemComponent,
      GenericThingComponent,
      SmartPlugComponent,
      SmartLightComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (): IData => {
    const [$things, things$, getThings] = let$$<IGenericThing[]>([]);
    const showOffLine = false;

    const merossDiscover$ = new MerossThingDiscovery({
      ...MEROS_CONFIG,
      fetch: asyncFetchJSONWithoutCors,
      openWebSocketMqttClient: openWebSocketMqttClientWithoutCors,
    }).discover({ showOffLine });

    const tuyaDiscover$ = new TuyaThingDiscovery({
      ...TUYA_CONFIG,
      tuyaUserId: 'eu1554304258632qrMDF',
      location: 'central-europe',
      fetch: asyncFetchJSONWithoutCors,
    }).discover({ showOffLine });

    const discover$ = mergePushSourceWithBackPressure<IGenericThing>([
      merossDiscover$,
      tuyaDiscover$,
    ]);

    discover$((thing: IGenericThing, abortable: Abortable): AsyncTask<void> => {
      console.log(thing);
      $things(
        [
          ...getThings(),
          thing,
        ]
          .sort((a: IGenericThing, b: IGenericThing): number => {
            return Number(b.description.isOnline) - Number(a.description.isOnline);
          }),
      );
      return AsyncTask.void(abortable);
    }, Abortable.never);

    return {
      things$,
    };
  },
});
