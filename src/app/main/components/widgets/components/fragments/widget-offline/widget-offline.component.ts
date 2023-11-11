import { compileStyleAsComponentStyle, Component, INJECT_CONTENT_TEMPLATE, VirtualComponentNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-offline.component.scss?inline';

/**
 * COMPONENT: 'app-widget-offline'
 **/

export const WidgetOfflineComponent = new Component<HTMLElement, object, object>({
  name: 'app-widget-offline',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  templateData: (node: VirtualComponentNode<HTMLElement, object>): void => {
    cssVarsSizeModifierFunction(node);
  },
});
