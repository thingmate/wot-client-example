import { IIntervalNode, IMapNode, IMergeNode, IShareNode, ISingleNode } from './schema';
import { transpileUnknownNode } from './transpile/transpile';



export function debugSchema() {
  const _interval: IIntervalNode = {
    type: 'interval',
    ms: 1000,
  };

  const _map: IMapNode = {
    type: 'map',
    node: _interval,
    expression: 'Math.random()',
  };

  const _single: ISingleNode = {
    type: 'single',
    value: 5,
  };

  const _merge: IMergeNode = {
    type: 'merge',
    nodes: [
      _map,
      _single,
    ],
  };

  const _share: IShareNode = {
    type: 'share',
    node: _merge,
  };

  console.log(transpileUnknownNode(_map).join('\n'));
}
