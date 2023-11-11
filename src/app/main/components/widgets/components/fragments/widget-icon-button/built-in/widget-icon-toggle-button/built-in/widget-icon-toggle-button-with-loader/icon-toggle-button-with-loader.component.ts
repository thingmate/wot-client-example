import { IObservable } from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component, VirtualComponentNode, input, Input } from '@lirx/dom';
import { MatDualRingLoaderComponent } from '@lirx/dom-material';
import { WidgetIconToggleButtonComponent } from '../../widget-icon-toggle-button.component';

// @ts-ignore
import html from './icon-toggle-button-with-loader.component.html?raw';
// @ts-ignore
import style from './icon-toggle-button-with-loader.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-toggle-button-with-loader'
 **/

export interface IWidgetIconToggleButtonWithLoaderComponentData {
  readonly active: Input<boolean>;
  readonly loading: Input<boolean>;
}

interface ITemplateData {
  readonly active$: IObservable<boolean>;
}

export const IconToggleButtonWithLoaderComponent = new Component<HTMLElement, IWidgetIconToggleButtonWithLoaderComponentData, ITemplateData>({
  name: 'app-widget-icon-toggle-button-with-loader',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      WidgetIconToggleButtonComponent,
      MatDualRingLoaderComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IWidgetIconToggleButtonWithLoaderComponentData => {
    return {
      active: input<boolean>(),
      loading: input<boolean>(false),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IWidgetIconToggleButtonWithLoaderComponentData>): ITemplateData => {
    const active$ = node.input$('active');
    const loading$ = node.input$('loading');

    node.setReactiveClass('loading', loading$);

    return {
      active$,
    };
  },
});
