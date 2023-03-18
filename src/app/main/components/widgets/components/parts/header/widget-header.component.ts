import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { setReactiveWidthAndHeightCSSVariables } from '@lirx/dom-material';

// @ts-ignore
import html from './widget-header.component.html?raw';
// @ts-ignore
import style from './widget-header.component.scss?inline';

/**
 * COMPONENT: 'app-widget-header'
 **/

interface IData {
}

interface IWidgetHeaderComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const WidgetHeaderComponent = createComponent<IWidgetHeaderComponentConfig>({
  name: 'app-widget-header',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IWidgetHeaderComponentConfig>): IData => {
    setReactiveWidthAndHeightCSSVariables(node);
    return {};
  },
});
