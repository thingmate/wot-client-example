import { Abortable, AsyncTask } from '@lirx/async-task';
import { IObservable, let$$ } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatColumnComponent, MatColumnItemComponent } from '@lirx/dom-material';
import { IGenericThing, ISmartPlugThing } from '@thingmate/wot-scripting-api';
import { asyncFetchJSONWithoutCORS } from '../../../../misc/get-cors-proxy-url';
import { SmartLightComponent } from './components/devices/smart-light/smart-light.component';
import { SmartPlugComponent } from './components/devices/smart-plug/smart-plug.component';
import { MEROS_CONFIG } from './components/vendors/meross/mss310/meross-config.private';
import { MerossMss310Component } from './components/vendors/meross/mss310/meross-mss310.component';
import { MerossThingDiscovery } from '@thingmate/vendor-meross';

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
      SmartPlugComponent,
      SmartLightComponent,
      MerossMss310Component,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (): IData => {
    const [$things, things$, getThings] = let$$<IGenericThing[]>([]);

    const discover$ = new MerossThingDiscovery({
      ...MEROS_CONFIG,
      fetch: asyncFetchJSONWithoutCORS,
    }).discover();

    discover$((thing: IGenericThing, abortable: Abortable): AsyncTask<void> => {
      console.log(thing);
      $things([
        ...getThings(),
        thing,
      ]);
      return AsyncTask.void(abortable);
    }, Abortable.never);

    return {
      things$,
    };
  },
});
