import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
// import { MatIconsSearchComponent } from '@lirx/mdi';
import { WidgetsComponent } from './components/widgets/widgets.component';

// @ts-ignore
import html from './main.component.html?raw';
// @ts-ignore
import style from './main.component.scss?inline';

/**
 * COMPONENT: 'app-main'
 **/

interface IData {
}

interface IMainComponentConfig {
  element: HTMLElement;
  data: IData;
}

export const MainComponent = createComponent<IMainComponentConfig>({
  name: 'app-main',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      // MatIconsSearchComponent,
      WidgetsComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  init: (node: VirtualCustomElementNode<IMainComponentConfig>): IData => {
    // node.setClass('dark-theme', true);
    return {};
  },
});
