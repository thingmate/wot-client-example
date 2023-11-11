import { compileStyleAsComponentStyle, Component, INJECT_CONTENT_TEMPLATE, VirtualComponentNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-header.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header'
 **/

export const WidgetHeaderComponent = new Component<HTMLElement, object, object>({
  name: 'app-widget-header',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  templateData: (node: VirtualComponentNode<HTMLElement, object>): void => {
    cssVarsSizeModifierFunction(node);
  },
});
