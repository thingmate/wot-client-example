import { IObservable } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatDualRingLoaderComponent } from '@lirx/dom-material';
import { WidgetIconToggleButtonComponent } from '../../widget-icon-toggle-button.component';

// @ts-ignore
import html from './icon-toggle-button-with-loader.component.html?raw';
// @ts-ignore
import style from './icon-toggle-button-with-loader.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-toggle-button-with-loader'
 **/

interface IData {
  readonly active$: IObservable<boolean>;
}

interface IWidgetIconToggleButtonWithLoaderComponentConfig {
  element: HTMLElement;
  inputs: [
    ['active', boolean],
    ['loading', boolean],
  ],
  data: IData;
}

export const IconToggleButtonWithLoaderComponent = createComponent<IWidgetIconToggleButtonWithLoaderComponentConfig>({
  name: 'app-widget-icon-toggle-button-with-loader',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetIconToggleButtonComponent,
      MatDualRingLoaderComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['active'],
    ['loading', false],
  ],
  init: (node: VirtualCustomElementNode<IWidgetIconToggleButtonWithLoaderComponentConfig>): IData => {
    const active$ = node.inputs.get$('active');
    const loading$ = node.inputs.get$('loading');

    node.setReactiveClass('loading', loading$);

    return {
      active$,
    };
  },
});
