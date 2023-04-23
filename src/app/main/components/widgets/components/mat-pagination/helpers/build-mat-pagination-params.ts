import { $$distinct, $$map, IObservable, IObserver, let$$ } from '@lirx/core';
import { IMatPaginationItem } from '../types/mat-pagination-item.type';
import { buildMatPaginationItems, IBuildMatPaginationItemsOptions } from './build-mat-pagination-items';
import { clampPageIndex } from './clamp-page-index';

export interface IBuildMatPaginationParamsOptions extends Omit<IBuildMatPaginationItemsOptions, 'navigateToPage' | 'selectedPageIndex'> {
}

export interface IBuildMatPaginationParamsResult {
  paginationItems$: IObservable<readonly IMatPaginationItem[]>,
  selectedPageIndex$: IObservable<number>,
  $selectedPageIndex: IObserver<number>,
}

export function buildMatPaginationParams(
  options: IBuildMatPaginationParamsOptions,
): IBuildMatPaginationParamsResult {
  const [$paginationItems, paginationItems$] = let$$<IMatPaginationItem[]>();
  const [_$selectedPageIndex, selectedPageIndex$] = let$$<number>();

  const $selectedPageIndex = $$map(
    $$distinct(
      _$selectedPageIndex,
    ),
    (selectedPageIndex: number): number => {
      return clampPageIndex(selectedPageIndex, options.count);
    },
  );

  selectedPageIndex$((selectedPageIndex: number): void => {
    $paginationItems(
      buildMatPaginationItems({
        ...options,
        selectedPageIndex,
      }),
    );
  });

  $selectedPageIndex(0);

  return {
    paginationItems$,
    selectedPageIndex$,
    $selectedPageIndex,
  };
}

