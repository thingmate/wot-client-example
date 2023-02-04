import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { MatDualRingLoaderComponent, MatRippleComponent } from '@lirx/dom-material';
import { IconCogComponent, IconDragVerticalComponent } from '@lirx/mdi';

// @ts-ignore
import html from './widget-template.component.html?raw';
// @ts-ignore
import style from './widget-template.component.scss?inline';

/**
 * COMPONENT: 'app-widget-template'
 **/

interface IWidgetTemplateComponentConfig {
  element: HTMLElement;
  inputs: [
    ['loading', boolean],
  ],
}

export const WidgetTemplateComponent = createComponent<IWidgetTemplateComponentConfig>({
  name: 'app-widget-template',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatDualRingLoaderComponent,
      MatRippleComponent,
      IconDragVerticalComponent,
      IconCogComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['loading', false],
  ],
  init: (node: VirtualCustomElementNode<IWidgetTemplateComponentConfig>): void => {
    const loading$ = node.inputs.get$('loading');
    node.setReactiveClass('loading', loading$);
  }
});
