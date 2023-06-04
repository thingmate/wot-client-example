import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { WidgetIconButtonComponent } from '../../widget-icon-button.component';

// @ts-ignore
import html from './widget-icon-toggle-button.component.html?raw';
// @ts-ignore
import style from './widget-icon-toggle-button.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-toggle-button'
 **/

interface IWidgetIconToggleButtonComponentConfig {
  element: HTMLElement;
  inputs: [
    ['active', boolean],
  ],
}

export const WidgetIconToggleButtonComponent = createComponent<IWidgetIconToggleButtonComponentConfig>({
  name: 'app-widget-icon-toggle-button',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      WidgetIconButtonComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['active', false],
  ],
  init: (node: VirtualCustomElementNode<IWidgetIconToggleButtonComponentConfig>): void => {
    const active$ = node.inputs.get$('active');
    node.setReactiveClass('active', active$);
  },
});
