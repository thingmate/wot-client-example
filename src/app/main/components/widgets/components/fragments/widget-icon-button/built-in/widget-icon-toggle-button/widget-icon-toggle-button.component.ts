import {
  compileReactiveHTMLAsComponentTemplate,
  compileStyleAsComponentStyle,
  Component,
  VirtualComponentNode,
  Input,
  input,
} from '@lirx/dom';
import { WidgetIconButtonComponent } from '../../widget-icon-button.component';

// @ts-ignore
import html from './widget-icon-toggle-button.component.html?raw';
// @ts-ignore
import style from './widget-icon-toggle-button.component.scss?inline';

/**
 * COMPONENT: 'app-widget-icon-toggle-button'
 **/

export interface IWidgetIconToggleButtonComponentData {
  readonly active: Input<boolean>;
}

export const WidgetIconToggleButtonComponent = new Component<HTMLElement, IWidgetIconToggleButtonComponentData, object>({
  name: 'app-widget-icon-toggle-button',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      WidgetIconButtonComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  componentData: (): IWidgetIconToggleButtonComponentData => {
    return {
      active: input<boolean>(false),
    };
  },
  templateData: (node: VirtualComponentNode<HTMLElement, IWidgetIconToggleButtonComponentData>): void => {
    const active$ = node.input$('active');
    node.setReactiveClass('active', active$);
  },
});
