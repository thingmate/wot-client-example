import { IIntervalNode, IMapNode, ISingleNode, IUnknownNode } from '../schema';

export function transpileSingleNode(
  {
    value,
  }: ISingleNode,
): string[] {
  return [
    `single(${value})`,
  ];
}

export function transpileIntervalNode(
  {
    ms,
  }: IIntervalNode,
): string[] {
  return [
    `interval(${ms})`,
  ];
}

export function transpileMapNode(
  {
    node,
    expression,
  }: IMapNode,
): string[] {
  return [
    `map$$(`,
    ...transpileUnknownNode(node),
    `,`,
    `(value) => (${expression})`,
    `)`,
  ];
}

export function transpileUnknownNode(
  node: IUnknownNode,
): string[] {
  switch (node.type) {
    case 'single':
      return transpileSingleNode(node);
    case 'interval':
      return transpileIntervalNode(node);
    case 'map':
      return transpileMapNode(node);
    default:
      throw new Error(`Unknown type of node`);
  }
}
