import { debug } from './__debug/debug';
import { start } from './app/start';

function main(): void {
  // debug();
  start();
}

window.onload = main;

