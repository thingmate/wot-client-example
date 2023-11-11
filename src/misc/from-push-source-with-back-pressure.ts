import { Abortable, AsyncTask, AbortableController, IAsyncTaskResolvedState } from '@lirx/async-task';
import {
  createErrorNotification,
  createNextNotification,
  IDefaultNotificationsUnion,
  IObservable,
  IObserver,
  IUnsubscribeOfObservable,
  STATIC_COMPLETE_NOTIFICATION,
} from '@lirx/core';
import { IPushSourceWithBackPressure } from '@lirx/stream';

export function fromPushSourceWithBackPressure<GValue>(
  source: IPushSourceWithBackPressure<GValue>,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  return (emit: IObserver<IDefaultNotificationsUnion<GValue>>): IUnsubscribeOfObservable => {

    let running: boolean = true;
    const abortableController: AbortableController = new AbortableController();

    AsyncTask.whenResolved(
      source(
        (value: GValue, abortable: Abortable): AsyncTask<void> => {
          if (running) {
            emit(createNextNotification(value));
          }
          return AsyncTask.void(abortable);
        },
        abortableController.abortable,
      ),
      (state: IAsyncTaskResolvedState<void>): void => {
        if (running) {
          switch (state.state) {
            case 'success':
              emit(STATIC_COMPLETE_NOTIFICATION);
              break;
            case 'error':
              emit(createErrorNotification(state.error));
              break;
            case 'abort':
              emit(createErrorNotification(state.reason));
              break;
          }
        }
      },
    );

    return (): void => {
      if (running) {
        running = false;
        abortableController.abort('cancelled');
      }
    };
  };
}
