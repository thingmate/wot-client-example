import { Abortable, AsyncTask } from '@lirx/async-task';
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
    const [abort, abortable] = Abortable.derive();

    source(
      (value: GValue, abortable: Abortable): AsyncTask<void> => {
        if (running) {
          emit(createNextNotification(value));
        }
        return AsyncTask.void(abortable);
      },
      abortable,
    )
      .then(
        (): void => {
          if (running) {
            emit(STATIC_COMPLETE_NOTIFICATION);
          }
        },
        (error: unknown) => {
          if (running) {
            emit(createErrorNotification(error));
          }
        },
      );

    return (): void => {
      if (running) {
        running = false;
        abort('cancelled');
      }
    };
  };
}
