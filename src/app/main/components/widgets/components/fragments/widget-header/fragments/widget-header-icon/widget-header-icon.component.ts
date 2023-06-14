import { compileStyleAsComponentStyle, createComponent, INJECT_CONTENT_TEMPLATE } from '@lirx/dom';

// @ts-ignore
import style from './widget-header-icon.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header-icon'
 **/

interface IWidgetHeaderIconComponentConfig {
  element: HTMLElement;
}

export const WidgetHeaderIconComponent = createComponent<IWidgetHeaderIconComponentConfig>({
  name: 'app-widget-header-icon',
  template: INJECT_CONTENT_TEMPLATE,
  styles: [compileStyleAsComponentStyle(style)],
});
