import { function$$, IObservable, IObserver, let$$, single } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { IconPowerComponent, IconPowerSocketDeComponent } from '@lirx/mdi';
import { createConsumedThingFromThingDescription, fetchTD, IWoT } from '@thingmate/wot-scripting-api';
import { IConsumedThing } from '@thingmate/wot-scripting-api/src/wot/consumed-thing/comsumed-thing.trait-collection';
import { ThingDescription } from 'wot-typescript-definitions';
import { runWoTContext } from '../../wot/run-wot-context';
import { WidgetTemplateComponent } from '../widget-template/widget-template.component';

// @ts-ignore
import html from './smart-plug.component.html?raw';
// @ts-ignore
import style from './smart-plug.component.scss?inline';

/**
 * COMPONENT: 'app-smart-plug'
 **/

export type ISmartPlugState =
  | 'on'
  | 'off'
  ;

interface IData {
  readonly $onClickOnOffToggleButton: IObserver<any>;
  readonly consumption$: IObservable<number>;
}

interface ISmartPlugComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const SmartPlugComponent = createComponent<ISmartPlugComponentConfig>({
  name: 'app-smart-plug',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetTemplateComponent,
      IconPowerSocketDeComponent,
      IconPowerComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<ISmartPlugComponentConfig>): IData => {
    const [$state, state$, getState] = let$$<ISmartPlugState>();
    const consumption$ = single(154);

    const getConsumedThing = () => {
      return runWoTContext((WoT: IWoT) => {
        return fetchTD('http://192.168.1.18:8080/19011080184063251h0234298f1495fe')
          .then((td: ThingDescription): Promise<IConsumedThing> => {
            return createConsumedThingFromThingDescription(WoT, td);
          });
      });
    };

    getConsumedThing()
      .then((thing: IConsumedThing): void => {
        const propertyState = thing.getProperty<ISmartPlugState>('state');

        propertyState.read();
      });

    const $onClickOnOffToggleButton = () => {
      // $state(!getState());
    };

    const classNames$ = function$$(
      [state$],
      (state: ISmartPlugState): Set<string> => {
        return new Set<string>([
          `state-${state}`,
        ]);
      },
    );
    node.setReactiveClassNamesList(classNames$);

    return {
      $onClickOnOffToggleButton,
      consumption$,
    };
  },
});
