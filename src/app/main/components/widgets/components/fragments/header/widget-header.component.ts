import { compileStyleAsComponentStyle, createComponent, INJECT_CONTENT_TEMPLATE, VirtualCustomElementNode } from '@lirx/dom';
import { setReactiveWidthAndHeightCSSVariables } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-header.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header'
 **/

interface IWidgetHeaderComponentConfig {
  element: HTMLElement;
}

export const WidgetHeaderComponent = createComponent<IWidgetHeaderComponentConfig>({
  name: 'app-widget-header',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetHeaderComponentConfig>): void => {
    setReactiveWidthAndHeightCSSVariables(node);
  },
});
