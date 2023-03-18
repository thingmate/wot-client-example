export interface ISingleNode {
  type: 'single';
  value: any;
}

export interface IIntervalNode {
  type: 'interval';
  ms: number;
}

export interface IMapNode {
  type: 'map';
  node: IUnknownNode;
  expression: string;
}

export interface IShareNode {
  type: 'share';
  node: IUnknownNode;
}

export interface IMergeNode {
  type: 'merge';
  nodes: IUnknownNode[];
}

export type IUnknownNode =
  | ISingleNode
  | IIntervalNode
  | IMapNode
  | IShareNode
  | IMergeNode
  ;

// interface ILink {
//   in: IUnknownNode;
//   out: IUnknownNode;
// }

/*---------------*/

export type IPartialNode = Pick<IUnknownNode, 'type'> & Partial<Omit<IUnknownNode, 'type'>>;


export interface IPositionedNode {
  position: [x: number, y: number],
  node: IPartialNode;
}

