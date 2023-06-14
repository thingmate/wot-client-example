import { createNotification, freeze, function$$, INotification } from '@lirx/core';
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

export const STATIC_LOADING_NOTIFICATION = freeze(createNotification('loading', void 0));
export const STATIC_RUNNING_NOTIFICATION = freeze(createNotification('running', void 0));

export type IWidgetTemplateStateNotifications =
  | INotification<'loading', void>
  | INotification<'error', any>
  | INotification<'running', any>
  ;

interface IWidgetTemplateComponentConfig {
  element: HTMLElement;
  inputs: [
    ['state', IWidgetTemplateStateNotifications],
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
    ['state', STATIC_LOADING_NOTIFICATION],
  ],
  init: (node: VirtualCustomElementNode<IWidgetTemplateComponentConfig>): void => {
    const state$ = node.inputs.get$('state');

    const classNames$ = function$$(
      [state$],
      (state: IWidgetTemplateStateNotifications): Set<string> => {
        return new Set<string>([
          `state-${state.name}`,
        ]);
      },
    );
    node.setReactiveClassNamesList(classNames$);
  },
});
