import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { fromResizeObserver } from '@lirx/core';
import { SmartLightComponent } from './components/smart-light/smart-light.component';
import { SmartPlugComponent } from './components/smart-plug/smart-plug.component';

// @ts-ignore
import html from './widgets.component.html?raw';
// @ts-ignore
import style from './widgets.component.scss?inline';

/**
 * COMPONENT: 'app-widgets'
 **/

interface IData {
}

interface IWidgetsComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const WidgetsComponent = createComponent<IWidgetsComponentConfig>({
  name: 'app-widgets',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      SmartPlugComponent,
      SmartLightComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetsComponentConfig>): IData => {
    const size$ = fromResizeObserver(node.elementNode);
    const minColumSize: number = 300;

    node.onConnected$(size$)((size: ResizeObserverEntry) => {
      const columnCount: number = Math.max(1, Math.floor(size.contentRect.width / minColumSize));
      const columnWidth: number = size.contentRect.width / columnCount;
      node.setStyleProperty('--column-width', `${columnWidth}px`);
    });
    return {};
  },
});
