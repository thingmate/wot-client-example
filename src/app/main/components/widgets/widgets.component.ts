import { Abortable, AsyncTask } from '@lirx/async-task';
import { IObservable, let$$ } from '@lirx/core';
import { mergePushSourceWithBackPressure } from '@lirx/stream';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component } from '@lirx/dom';
import { MatColumnComponent, MatColumnItemComponent } from '@lirx/dom-material';
import { createTuyaThingDiscovery } from '@thingmate/vendor-tuya';
import { createMerossThingDiscovery } from '@thingmate/vendor-meross';
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

interface ITemplateData {
  readonly things$: IObservable<readonly IGenericThing[]>;
}

export const WidgetsComponent = new Component<HTMLElement, object, ITemplateData>({
  name: 'app-widgets',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      MatColumnComponent,
      MatColumnItemComponent,
      GenericThingComponent,
      SmartPlugComponent,
      SmartLightComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  templateData: (): ITemplateData => {
    const [$things, things$, getThings] = let$$<IGenericThing[]>([]);
    const showOffLine = true;

    const merossDiscover$ = createMerossThingDiscovery({
      ...MEROS_CONFIG,
      fetch: asyncFetchJSONWithoutCors,
      openWebSocketMqttClient: openWebSocketMqttClientWithoutCors,
    }).discover;

    const tuyaDiscover$ = createTuyaThingDiscovery({
      ...TUYA_CONFIG,
      location: 'central-europe',
      fetch: asyncFetchJSONWithoutCors,
    }).discover;

    const discover$ = mergePushSourceWithBackPressure<IGenericThing>([
      merossDiscover$,
      tuyaDiscover$,
    ]);

    discover$((thing: IGenericThing, abortable: Abortable): AsyncTask<void> => {
      if (thing.description.online || showOffLine) {
        console.log(thing);
        $things(
          [
            ...getThings(),
            thing,
          ]
            .sort((a: IGenericThing, b: IGenericThing): number => {
              return Number(b.description.online) - Number(a.description.online);
            }),
        );
      }
      return AsyncTask.void(abortable);
    }, Abortable.never);

    return {
      things$,
    };
  },
});
