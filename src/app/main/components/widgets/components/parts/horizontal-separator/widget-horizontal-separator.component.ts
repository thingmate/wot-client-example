import { compileStyleAsComponentStyle, createComponent } from '@lirx/dom';

// @ts-ignore
import html from './widget-horizontal-separator.component.html?raw';
// @ts-ignore
import style from './widget-horizontal-separator.component.scss?inline';

/**
 * COMPONENT: 'app-widget-horizontal-separator'
 **/

interface IWidgetHorizontalSeparatorComponentConfig {
  element: HTMLElement;
}

export const WidgetHorizontalSeparatorComponent = createComponent<IWidgetHorizontalSeparatorComponentConfig>({
  name: 'app-widget-horizontal-separator',
  styles: [compileStyleAsComponentStyle(style)],
});
