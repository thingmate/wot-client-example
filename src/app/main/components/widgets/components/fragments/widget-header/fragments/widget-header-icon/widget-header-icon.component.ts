import { compileStyleAsComponentStyle, Component, INJECT_CONTENT_TEMPLATE } from '@lirx/dom';

// @ts-ignore
import style from './widget-header-icon.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header-icon'
 **/

export const WidgetHeaderIconComponent = new Component<HTMLElement, object, object>({
  name: 'app-widget-header-icon',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
});
