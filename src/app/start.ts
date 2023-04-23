import { bootstrap } from '@lirx/dom';
import { debugObservableProxy } from '../__debug/debug-observable-proxy';
import { MainComponent } from './main/main.component';

export function start() {
  // debugObservableProxy();
  bootstrap(MainComponent);
}
