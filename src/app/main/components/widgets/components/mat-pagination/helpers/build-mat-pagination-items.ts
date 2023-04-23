import {
  IMatPaginationItem, IMatPaginationItemButton,
  IMatPaginationItemEllipsis, IMatPaginationItemFirst,
  IMatPaginationItemLast,
  IMatPaginationItemNext,
  IMatPaginationItemPage, IMatPaginationItemPrevious,
} from '../types/mat-pagination-item.type';

export interface IBuildMatPaginationItemsOptions {
  count: number;
  selectedPageIndex: number;
  siblingCount?: number,
  boundaryCount?: number,
  firstButtonVisible?: boolean;
  previousButtonVisible?: boolean;
  nextButtonVisible?: boolean;
  lastButtonVisible?: boolean;
}

export function buildMatPaginationItems(
  {
    count,
    selectedPageIndex,
    siblingCount = 1,
    boundaryCount = 1,
    firstButtonVisible = false,
    previousButtonVisible = true,
    nextButtonVisible = true,
    lastButtonVisible = false,
  }: IBuildMatPaginationItemsOptions,
): IMatPaginationItem[] {
  count = Math.max(0, count);
  siblingCount = Math.max(0, siblingCount);
  boundaryCount = Math.max(0, boundaryCount);
  selectedPageIndex = Math.max(0, Math.min(count - 1, selectedPageIndex));

  const items: IMatPaginationItem[] = [];

  const generateMatPaginationItemButton = (
    pageIndex: number,
  ): IMatPaginationItemButton => {
    return {
      pageIndex,
      disabled: (selectedPageIndex === pageIndex),
    };
  };

  const generateMatPaginationItemFirst = (): IMatPaginationItemFirst => {
    return {
      ...generateMatPaginationItemButton(0),
      type: 'first',
    };
  };

  const generateMatPaginationItemPrevious = (): IMatPaginationItemPrevious => {
    return {
      ...generateMatPaginationItemButton(Math.max(0, selectedPageIndex - 1)),
      type: 'previous',
    };
  };

  const generateMatPaginationItemPage = (
    pageIndex: number,
  ): IMatPaginationItemPage => {
    return {
      ...generateMatPaginationItemButton(pageIndex),
      type: 'page',
      selected: (selectedPageIndex === pageIndex),
    };
  };

  const generateMatPaginationItemEllipsis = (): IMatPaginationItemEllipsis => {
    return {
      type: 'ellipsis',
    };
  };

  const generateMatPaginationItemNext = (): IMatPaginationItemNext => {
    return {
      ...generateMatPaginationItemButton(Math.min(selectedPageIndex + 1, count - 1)),
      type: 'next',
    };
  };

  const generateMatPaginationItemLast = (): IMatPaginationItemLast => {
    return {
      ...generateMatPaginationItemButton(Math.max(0, count - 1)),
      type: 'last',
    };
  };

  const generatePages = (
    start: number,
    end: number,
  ): void => {
    for (let i = start; i < end; i++) {
      items.push(generateMatPaginationItemPage(i));
    }
  };

  /* ITEMS */

  if (firstButtonVisible) {
    items.push(generateMatPaginationItemFirst());
  }

  if (previousButtonVisible) {
    items.push(generateMatPaginationItemPrevious());
  }

  // [boundaryCount, 1 (first ellipsis), siblingCount, 1 (selected), siblingCount, 1 (last ellipsis), boundaryCount]

  const a: number = boundaryCount + 1 + siblingCount;

  if (count <= (a + 1 + a)) {
    generatePages(0, count);
  } else {
    if (selectedPageIndex > a) { // requires first ellipsis
      generatePages(0, boundaryCount);

      items.push(generateMatPaginationItemEllipsis());

      if (selectedPageIndex < (count - a)) { // requires last ellipsis
        generatePages(selectedPageIndex - siblingCount, selectedPageIndex + 1 /* selected */ + siblingCount);
        items.push(generateMatPaginationItemEllipsis());
        generatePages(count - boundaryCount, count);
      } else {
        generatePages(count - (siblingCount + 1 /*selected*/ + siblingCount + 1 /*ellipsis*/ + boundaryCount), count);
      }
    } else { // requires last ellipsis
      generatePages(0, boundaryCount + 1 /*ellipsis*/ + siblingCount + 1 /* selected */ + siblingCount);
      items.push(generateMatPaginationItemEllipsis());
      generatePages(count - boundaryCount, count);
    }
  }

  if (nextButtonVisible) {
    items.push(generateMatPaginationItemNext());
  }

  if (lastButtonVisible) {
    items.push(generateMatPaginationItemLast());
  }

  return items;
}
