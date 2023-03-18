import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatColumnComponent, MatColumnItemComponent } from '@lirx/dom-material';
import { SmartPlugComponent } from './components/smart-plug/smart-plug.component';

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
      SmartPlugComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetsComponentConfig>): void => {
  },
});
