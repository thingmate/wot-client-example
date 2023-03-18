import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatRippleComponent } from '@lirx/dom-material';

// @ts-ignore
import html from './widget-icon-button.component.html?raw';
// @ts-ignore
import style from './widget-icon-button.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-button'
 **/

interface IData {
}

interface IWidgetIconButtonComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const WidgetIconButtonComponent = createComponent<IWidgetIconButtonComponentConfig>({
  name: 'app-widget-icon-button',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatRippleComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetIconButtonComponentConfig>): IData => {
    return {};
  },
});
