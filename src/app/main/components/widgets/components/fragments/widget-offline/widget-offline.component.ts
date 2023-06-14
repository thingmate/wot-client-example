import { compileStyleAsComponentStyle, createComponent, INJECT_CONTENT_TEMPLATE, VirtualCustomElementNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-offline.component.scss?inline';

/**
 * COMPONENT: 'app-widget-offline'
 **/

interface IWidgetOfflineComponentConfig {
  element: HTMLElement;
}

export const WidgetOfflineComponent = createComponent<IWidgetOfflineComponentConfig>({
  name: 'app-widget-offline',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetOfflineComponentConfig>): void => {
    cssVarsSizeModifierFunction(node);
  },
});
