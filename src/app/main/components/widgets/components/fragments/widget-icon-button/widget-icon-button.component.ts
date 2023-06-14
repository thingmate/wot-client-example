import { compileStyleAsComponentStyle, createComponent, INJECT_CONTENT_TEMPLATE, VirtualCustomElementNode } from '@lirx/dom';
import { matRippleModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-icon-button.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-button'
 **/

interface IWidgetIconButtonComponentConfig {
  element: HTMLElement;
}

export const WidgetIconButtonComponent = createComponent<IWidgetIconButtonComponentConfig>({
  name: 'app-widget-icon-button',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetIconButtonComponentConfig>): void => {
    matRippleModifierFunction(node);
  },
});
