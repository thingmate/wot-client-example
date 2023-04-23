export interface IMatPaginationItemButton {
  readonly pageIndex: number;
  readonly disabled: boolean;
}

export interface IMatPaginationItemFirst extends IMatPaginationItemButton {
  readonly type: 'first';
}

export interface IMatPaginationItemPrevious extends IMatPaginationItemButton {
  readonly type: 'previous';
}

export interface IMatPaginationItemPage extends IMatPaginationItemButton {
  readonly type: 'page';
  readonly selected: boolean;
}

export interface IMatPaginationItemEllipsis {
  readonly type: 'ellipsis';
}

export interface IMatPaginationItemNext extends IMatPaginationItemButton {
  readonly type: 'next';
}

export interface IMatPaginationItemLast extends IMatPaginationItemButton {
  readonly type: 'last';
}

export type IMatPaginationItem =
  | IMatPaginationItemFirst
  | IMatPaginationItemPrevious
  | IMatPaginationItemPage
  | IMatPaginationItemEllipsis
  | IMatPaginationItemNext
  | IMatPaginationItemLast
  ;
