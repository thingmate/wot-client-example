import {
  createDraggableObservable,
  debounceTime$$,
  filter$$,
  first$$, first$$$,
  fromResizeObserver,
  function$$,
  idle,
  IDragEndNotification,
  IDraggableObservableNotifications,
  IObservable,
  IObserver,
  isDragEndNotification,
  let$$,
  map$$,
  map$$$,
  mapDistinct$$,
  merge,
  pipe$$, share$$,
  shareRL$$,
  shareRL$$$,
  switchMap$$,
  switchMap$$$,
  toString$$,
} from '@lirx/core';
import { compileReactiveHTMLAsComponentTemplate, compileStyleAsComponentStyle, createComponent, VirtualCustomElementNode } from '@lirx/dom';
import { ELEMENT_REFERENCE_MODIFIER } from '@lirx/dom-material';
import { noop } from '@lirx/utils';
import { IBuildMatPaginationParamsOptions } from '../mat-pagination/helpers/build-mat-pagination-params';
import { buildReactiveMatPaginationParams } from '../mat-pagination/helpers/build-reactive-mat-pagination-params';
import { MatPaginationComponent } from '../mat-pagination/mat-pagination.component';
import { IMatPaginationItem } from '../mat-pagination/types/mat-pagination-item.type';

// @ts-ignore
import html from './mat-column.component.html?raw';
// @ts-ignore
import style from './mat-column.component.scss?inline';

/**
 * COMPONENT: 'mat-column'
 */

interface IData {
  readonly $contentElement: IObserver<HTMLElement>;
  readonly $columnsElement: IObserver<HTMLElement>;
  readonly paginationItems$: IObservable<readonly IMatPaginationItem[]>;
  readonly $selectedPageIndex: IObservable<IObserver<number>>;
}

interface IMatColumnComponentConfig {
  element: HTMLElement;
  inputs: [
    ['minColumnWidth', number],
  ];
  data: IData;
}

export const MatColumnComponent = createComponent<IMatColumnComponentConfig>({
  name: 'mat-column',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatPaginationComponent,
    ],
    modifiers: [
      ELEMENT_REFERENCE_MODIFIER,
    ],
  }),
  styles: [compileStyleAsComponentStyle(style)],
  inputs: [
    ['minColumnWidth'],
  ],
  init: (node: VirtualCustomElementNode<IMatColumnComponentConfig>): IData => {
    const [$contentElement, contentElement$] = let$$<HTMLElement>();
    const [$columnsElement, columnsElement$] = let$$<HTMLElement>();

    const width$ = pipe$$(columnsElement$, [
      switchMap$$$<HTMLElement, ResizeObserverEntry>((element: HTMLElement): IObservable<ResizeObserverEntry> => {
        return fromResizeObserver(element);
      }),
      map$$$<ResizeObserverEntry, number>((size: ResizeObserverEntry): number => {
        return size.contentRect.width;
      }),
    ]);

    const sharedWidth$ = shareRL$$<number>(width$);

    const scrollWidth$ = switchMap$$(columnsElement$, (element: HTMLElement): IObservable<number> => {
      return createScrollWidthObservable(element);
    });

    /* COLUMN WIDTH */

    const minColumnWidth$ = node.inputs.get$('minColumnWidth');

    const columnWidth$ = function$$(
      [minColumnWidth$, sharedWidth$],
      (minColumnWidth: number, width: number): string => {
        const columnCount: number = Math.max(1, Math.floor(width / minColumnWidth));
        // const columnWidthInPixels: number = width / columnCount;
        const columnWidthInPercent: number = 100 / columnCount;
        return `${columnWidthInPercent}%`;
      },
    );

    node.setReactiveStyleProperty('--mat-column-width', columnWidth$);

    /* PAGINATION */

    const pagesCountRaw$ = function$$(
      [sharedWidth$, scrollWidth$],
      (width: number, scrollWidth: number): number => {
        return Math.ceil(scrollWidth / width);
      },
    );

    const pagesCount$ = debounceTime$$(pagesCountRaw$, 100);

    const matPaginationParamsOptions$ = map$$(pagesCount$, (count: number): IBuildMatPaginationParamsOptions => {
      return {
        count,
      };
    });

    const {
      paginationItems$,
      selectedPageIndex$,
      $selectedPageIndex,
    } = buildReactiveMatPaginationParams(matPaginationParamsOptions$);

    const sharedSelectedPageIndex$ = shareRL$$(selectedPageIndex$);
    const $sharedSelectedPageIndex = shareRL$$($selectedPageIndex);

    node.setReactiveStyleProperty('--mat-column-page', toString$$(sharedSelectedPageIndex$));

    /* DRAG */

    const drag$ = switchMap$$(contentElement$, (element: HTMLElement): IObservable<IDraggableObservableNotifications<HTMLElement>> => {
      return createDraggableObservable(element);
    });

    const sharedDrag$ = shareRL$$<IDraggableObservableNotifications<HTMLElement>>(drag$);

    // .mat-dragging
    const isDragging$ = mapDistinct$$(sharedDrag$, (notification: IDraggableObservableNotifications<HTMLElement>): boolean => {
      return (notification.name !== 'drag-end');
    });

    node.setReactiveClass('mat-dragging', isDragging$);

    // --mat-column-drag
    const matColumnDrag$ = map$$(sharedDrag$, (notification: IDraggableObservableNotifications<HTMLElement>): string => {
      switch (notification.name) {
        case 'drag-start':
        case 'drag-move':
          return `${notification.value.delta.x}px`;
        case 'drag-end':
          return '0px';
      }
    });

    node.setReactiveStyleProperty('--mat-column-drag', matColumnDrag$);

    const onDragEnd$ = filter$$<IDraggableObservableNotifications<HTMLElement>, IDragEndNotification<HTMLElement>>(sharedDrag$, isDragEndNotification);

    const pageSelectedAfterDragEnd$ = switchMap$$(onDragEnd$, (notification: IDragEndNotification<HTMLElement>): IObservable<number> => {
      return first$$(
        function$$(
          [sharedWidth$, sharedSelectedPageIndex$],
          (width: number, selectedPageIndex: number): number => {
            const offsetX: number = -notification.value.delta.x;
            const pageOffset: number = Math.floor((Math.abs(offsetX) / width) + 0.75) * Math.sign(offsetX);
            return selectedPageIndex + pageOffset;
          },
        ),
      );
    });

    const updatePageSelectedOnDragEnd$ = switchMap$$(pageSelectedAfterDragEnd$, (selectedPageIndex: number): IObservable<void> => {
      return pipe$$($sharedSelectedPageIndex, [
        first$$$<IObserver<number>>(),
        map$$$<IObserver<number>, void>(($electedPageIndex: IObserver<number>): void => {
          $electedPageIndex(selectedPageIndex);
        }),
      ])
    });

    node.onConnected$(updatePageSelectedOnDragEnd$)(noop);

    return {
      $contentElement,
      $columnsElement,
      paginationItems$,
      $selectedPageIndex: $sharedSelectedPageIndex,
    };
  },
});

/** FUNCTIONS **/

export function createScrollWidthObservable(
  element: HTMLElement,
): IObservable<number> {
  const scrollWidthMayHaveChanged$ = merge([
    fromResizeObserver(element),
    idle(),
  ]);

  return mapDistinct$$(scrollWidthMayHaveChanged$, (): number => {
    return element.scrollWidth;
  });
}
