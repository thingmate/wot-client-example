import { Abortable } from '@lirx/async-task';
import { IObservable, map$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatGridComponent, MatGridItemComponent } from '@lirx/dom-material';
import { IconPowerSocketDeComponent } from '@lirx/mdi';
import { connectMerossDevice, IForgeWebSocketUrlFunction, initMerossMss310ExposedThing } from '@thingmate/vendor-meross';
import {
  createLinkedExposedAndConsumedThings,
  ISmartPlugConfig,
  ISmartPlugConsumedThing,
  SMART_PLUG_TD,
} from '@thingmate/wot-scripting-api';
import { getWebSocketProxyUrl } from '../../../../../../misc/get-web-socket-proxy-url';
import { WidgetHeaderComponent } from '../parts/header/widget-header.component';
import {
  ISmartPlugConsumptionConsumedThingProperty,
  SmartPlugPowerConsumptionComponent,
} from './components/smart-plug-power-consumption/smart-plug-power-consumption.component';
import {
  ISmartPlugStateConsumedThingProperty,
  SmartPlugToggleButtonComponent,
} from './components/smart-plug-toggle-button/smart-plug-toggle-button.component';
import { MEROSS_DEVICE, MEROSS_LOGIN_DATA } from './meross-config.private';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

interface IData {
  readonly title$: IObservable<string>;
  readonly stateProperty$: IObservable<ISmartPlugStateConsumedThingProperty>;
  readonly consumptionProperty$: IObservable<ISmartPlugConsumptionConsumedThingProperty>;
}

interface ISmartPlugComponentConfig {
  element: HTMLElement;
  inputs: [
    ['thing', ISmartPlugConsumedThing],
  ],
  data: IData;
}

export const SmartPlugComponent = createComponent<ISmartPlugComponentConfig>({
  name: 'app-smart-plug',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatGridComponent,
      MatGridItemComponent,
      WidgetHeaderComponent,
      IconPowerSocketDeComponent,
      SmartPlugToggleButtonComponent,
      SmartPlugPowerConsumptionComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['thing'],
  ],
  init: (node: VirtualCustomElementNode<ISmartPlugComponentConfig>): IData => {
    const thing$ = node.inputs.get$('thing');

    const _debug = async () => {
      const forgeWebSocketUrlFunction: IForgeWebSocketUrlFunction = (url: URL): URL => {
        return getWebSocketProxyUrl({
          hostname: url.hostname,
          port: Number(url.port),
          protocol: 'mqtt'
        });
      };

      const loginData = MEROSS_LOGIN_DATA;
      const device = MEROSS_DEVICE;

      const td = {
        // id: device.definition.uuid,
        id: `urn:uuid:${device.uuid}`,
        title: device.uuid,
        description: `Meross smart plug`,
        name: device.devName,
        ...SMART_PLUG_TD,
      };

      const [exposedThing, consumedThing] = createLinkedExposedAndConsumedThings<ISmartPlugConfig>(td);

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

      initMerossMss310ExposedThing({
        exposedThing,
        deviceOptions,
      });

      await exposedThing.expose();
      node.inputs.set('thing', consumedThing);
    };

    _debug();

    const title$ = map$$(thing$, (thing: ISmartPlugConsumedThing): string => {
      return thing.getDescription().title;
    });

    const stateProperty$ = map$$(thing$, (thing: ISmartPlugConsumedThing): ISmartPlugStateConsumedThingProperty => {
      return thing.getProperty('state');
    });

    const consumptionProperty$ = map$$(thing$, (thing: ISmartPlugConsumedThing): ISmartPlugConsumptionConsumedThingProperty => {
      return thing.getProperty('consumption');
    });

    return {
      title$,
      stateProperty$,
      consumptionProperty$,
    };
  },
});
