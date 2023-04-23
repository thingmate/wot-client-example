import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatColumnItemComponent } from './components/mat-column-item/mat-column-item.component';
import { MatColumnComponent } from './components/mat-column/mat-column.component';
import { MatPaginationComponent } from './components/mat-pagination/mat-pagination.component';
import { MerossMss310Component } from './components/vendors/meross/mss310/meross-mss310.component';

// @ts-ignore
import html from './widgets.component.html?raw';
// @ts-ignore
import style from './widgets.component.scss?inline';

/**
 * COMPONENT: 'app-widgets'
 **/

interface IWidgetsComponentConfig {
  element: HTMLElement;
}

export const WidgetsComponent = createComponent<IWidgetsComponentConfig>({
  name: 'app-widgets',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatColumnComponent,
      MatColumnItemComponent,
      MerossMss310Component,
      MatPaginationComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetsComponentConfig>): void => {
  },
});
