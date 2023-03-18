import { Abortable, AsyncTask } from '@lirx/async-task';
import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task.class';
import { fulfilled$$, IDefaultNotificationsUnion, IObservable } from '@lirx/core';
import { IConsumedThingObserver, IConsumedThingProperty } from '@thingmate/wot-scripting-api';
import { DataSchemaValue } from 'wot-typescript-definitions';
import { fromAsyncTaskFactory } from './from-async-task-factory';

export function observeConsumedThingProperty<GValue extends IAsyncTaskConstraint<GValue, DataSchemaValue>>(
  property: IConsumedThingProperty<string, GValue>
): IObservable<IDefaultNotificationsUnion<GValue>> {
  const observe$ = fromAsyncTaskFactory((abortable: Abortable): AsyncTask<IConsumedThingObserver<GValue>> => {
    return property.observe({ abortable });
  });

  return fulfilled$$(observe$, (observer: IConsumedThingObserver<GValue>) => {
    return observer.toObservable({ stopOnUnsubscribe: true });
  })
}
