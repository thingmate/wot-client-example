import { IObservable, IObserver, map$$, map$$$, pipe$$, shareRL$$$, switchMap$$ } from '@lirx/core';
import { IMatPaginationItem } from '../types/mat-pagination-item.type';
import { buildMatPaginationParams, IBuildMatPaginationParamsOptions, IBuildMatPaginationParamsResult } from './build-mat-pagination-params';

export interface IBuildReactiveMatPaginationParamsResult extends Omit<IBuildMatPaginationParamsResult, '$selectedPageIndex'> {
  $selectedPageIndex: IObservable<IObserver<number>>,
}

export function buildReactiveMatPaginationParams(
  options$: IObservable<IBuildMatPaginationParamsOptions>,
): IBuildReactiveMatPaginationParamsResult {
  const pagination$ = pipe$$(options$, [
    map$$$<IBuildMatPaginationParamsOptions, IBuildMatPaginationParamsResult>((options: IBuildMatPaginationParamsOptions): IBuildMatPaginationParamsResult => {
      return buildMatPaginationParams(options);
    }),
    shareRL$$$<IBuildMatPaginationParamsResult>(),
  ]);

  const paginationItems$ = switchMap$$(
    pagination$,
    ({ paginationItems$ }: IBuildMatPaginationParamsResult): IObservable<readonly IMatPaginationItem[]> => {
      return paginationItems$;
    },
  );

  const selectedPageIndex$ = switchMap$$(
    pagination$,
    ({ selectedPageIndex$ }: IBuildMatPaginationParamsResult): IObservable<number> => {
      return selectedPageIndex$;
    },
  );

  const $selectedPageIndex = map$$(pagination$, ({ $selectedPageIndex }: IBuildMatPaginationParamsResult): IObserver<number> => {
    return $selectedPageIndex;
  });

  return {
    paginationItems$,
    selectedPageIndex$,
    $selectedPageIndex,
  };
}
