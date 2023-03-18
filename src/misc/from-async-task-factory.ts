import { Abortable, AsyncTask, IAsyncTaskFactory } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task.class';
import {
  createErrorNotification,
  createNextNotification,
  IDefaultNotificationsUnion,
  IObservable,
  IObserver,
  IUnsubscribeOfObservable,
  STATIC_COMPLETE_NOTIFICATION,
} from '@lirx/core';

export function fromAsyncTaskFactory<GValue extends IAsyncTaskConstraint<GValue>>(
  factory: IAsyncTaskFactory<GValue>,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  return (emit: IObserver<IDefaultNotificationsUnion<GValue>>): IUnsubscribeOfObservable => {
    let running: boolean = true;
    const [abort, abortable] = Abortable.derive();

    AsyncTask.fromFactory(factory, abortable)
      .then(
        (value: GValue): void => {
          if (running) {
            emit(createNextNotification(value));
          }
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
