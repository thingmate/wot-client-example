import { compileStyleAsComponentStyle, createComponent, INJECT_CONTENT_TEMPLATE, VirtualCustomElementNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-header-title.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header-title'
 **/

interface IWidgetHeaderTitleComponentConfig {
  element: HTMLElement;
}

export const WidgetHeaderTitleComponent = createComponent<IWidgetHeaderTitleComponentConfig>({
  name: 'app-widget-header-title',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetHeaderTitleComponentConfig>): void => {
    cssVarsSizeModifierFunction(node);
  },
});
