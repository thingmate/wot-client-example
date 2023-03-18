import { runWoTContext } from '../wot/run-wot-context';
import { debugTestThing } from './debug-test-thing';
import { debugSchema } from './schema/debug-schema';



/*----------------*/

export async function debug() {
  // const _debug = debugTestThing;
  // await runWoTContext(_debug);
  await debugSchema();
}
