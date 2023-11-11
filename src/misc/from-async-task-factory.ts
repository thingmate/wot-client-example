import { AsyncTask, IAsyncTaskFactory, IAsyncTaskConstraint, AbortableController } from '@lirx/async-task';
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

    const abortableController: AbortableController = new AbortableController();

    AsyncTask.fromFactory(factory, abortableController.abortable)
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
        abortableController.abort('cancelled');
      }
    };
  };
}
