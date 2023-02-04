import { runWoTContext } from '../wot/run-wot-context';
import { debugTestThing } from './debug-test-thing';



/*----------------*/

export async function debug() {
  const _debug = debugTestThing;
  await runWoTContext(_debug);
}
