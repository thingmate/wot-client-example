import { compileStyleAsComponentStyle, Component } from '@lirx/dom';

// @ts-ignore
import style from './widget-horizontal-separator.component.scss?inline';

/**
 * COMPONENT: 'app-widget-horizontal-separator'
 **/

export const WidgetHorizontalSeparatorComponent = new Component<HTMLElement, object, object>({
  name: 'app-widget-horizontal-separator',
  styles: [compileStyleAsComponentStyle(style)],
});
