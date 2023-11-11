import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, Component } from '@lirx/dom';
// import { MatIconsSearchComponent } from '@lirx/mdi';
import { WidgetsComponent } from './components/widgets/widgets.component';

// @ts-ignore
import html from './main.component.html?raw';
// @ts-ignore
import style from './main.component.scss?inline';

/**
 * COMPONENT: 'app-main'
 **/

export const MainComponent = new Component<HTMLElement, object, object>({
  name: 'app-main',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    components: [
      // MatIconsSearchComponent,
      WidgetsComponent,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
});
