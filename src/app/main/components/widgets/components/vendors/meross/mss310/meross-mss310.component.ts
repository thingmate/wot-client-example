import { Abortable } from '@lirx/async-task';
import { IObservable, let$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { connectMerossDevice, createMerossMss310SmartPlugThing, IForgeWebSocketUrlFunction } from '@thingmate/vendor-meross';
import { ISmartPlugThing } from '@thingmate/wot-scripting-api';
import { getWebSocketProxyUrl } from '../../../../../../../../misc/get-web-socket-proxy-url';
import { SmartPlugComponent } from '../../../parts/devices/smart-plug/smart-plug.component';
import { MEROSS_DEVICE, MEROSS_LOGIN_DATA } from './meross-config.private';

// @ts-ignore
import html from './meross-mss310.component.html?raw';
// @ts-ignore
import style from './meross-mss310.component.scss?inline';

/**
 * COMPONENT: 'app-meross-mss310'
 **/

interface IData {
  readonly thing$: IObservable<ISmartPlugThing>;
}

interface ISmartPlugComponentConfig {
  element: HTMLElement;
  inputs: [
    ['thing', ISmartPlugThing],
  ],
  data: IData;
}

export const MerossMss310Component = createComponent<ISmartPlugComponentConfig>({
  name: 'app-meross-mss310',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      SmartPlugComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<ISmartPlugComponentConfig>): IData => {
    const [$thing, thing$] = let$$<ISmartPlugThing>();
    // const thing$ = node.inputs.get$('thing');

    const _debug = async () => {
      const forgeWebSocketUrlFunction: IForgeWebSocketUrlFunction = (url: URL): URL => {
        return getWebSocketProxyUrl({
          hostname: url.hostname,
          port: Number(url.port),
          protocol: 'mqtt',
        });
      };

      const loginData = MEROSS_LOGIN_DATA;
      const device = MEROSS_DEVICE;

      const deviceOptions = await connectMerossDevice({
        hostname: device.domain,
        deviceId: device.uuid,
        userId: loginData.userid,
        key: loginData.key,
        abortable: Abortable.never,
        forgeWebSocketUrlFunction,
        // forgeHttpMerossPacketUrlFunction,
      })
        .toPromise();

      const thing = createMerossMss310SmartPlugThing({
        deviceOptions,
      });

      $thing(thing);
    };

    _debug();

    return {
      thing$,
    };
  },
});
