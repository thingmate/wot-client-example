import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';

// @ts-ignore
import html from './mat-column.component.html?raw';
// @ts-ignore
import style from './mat-column-item.component.scss?inline';

/**
 * COMPONENT: 'mat-column-item'
 */

interface IMatColumnItemComponentConfig {
  element: HTMLElement;
}

export const MatColumnItemComponent = createComponent<IMatColumnItemComponentConfig>({
  name: 'mat-column-item',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
  }),
  styles: [compileStyleAsComponentStyle(style)],
});
