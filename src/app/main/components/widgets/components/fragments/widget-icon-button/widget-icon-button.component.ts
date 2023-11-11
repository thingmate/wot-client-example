import { compileStyleAsComponentStyle, Component, INJECT_CONTENT_TEMPLATE, VirtualComponentNode } from '@lirx/dom';
import { matRippleModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-icon-button.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-button'
 **/

export const WidgetIconButtonComponent = new Component<HTMLElement, object, object>({
  name: 'app-widget-icon-button',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  templateData: (node: VirtualComponentNode<HTMLElement, object>): void => {
    matRippleModifierFunction(node);
  },
});
