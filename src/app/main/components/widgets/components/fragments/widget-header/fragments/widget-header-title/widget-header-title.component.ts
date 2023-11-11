import { compileStyleAsComponentStyle, Component, INJECT_CONTENT_TEMPLATE, VirtualComponentNode } from '@lirx/dom';
import { cssVarsSizeModifierFunction } from '@lirx/dom-material';

// @ts-ignore
import style from './widget-header-title.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header-title'
 **/

export const WidgetHeaderTitleComponent = new Component<HTMLElement, object, object>({
  name: 'app-widget-header-title',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
  templateData: (node: VirtualComponentNode<HTMLElement, object>): void => {
    cssVarsSizeModifierFunction(node);
  },
});
