import { IAsyncTaskConstraint } from '@lirx/async-task/';
import { IDefaultNotificationsUnion, IObservable } from '@lirx/core';
import { mergePushSourceWithBackPressure, createPushSourceWithBackPressureFromAsyncTaskFactory } from '@lirx/stream';
import { createAsyncValueObserveFunctionFromReadFunction, IAsyncValueObserveFunction, IThingProperty } from '@thingmate/wot-scripting-api';
import { fromPushSourceWithBackPressure } from './from-push-source-with-back-pressure';

export function observeThingProperty<GValue extends IAsyncTaskConstraint<GValue>>(
  property: IThingProperty<GValue>,
  interval: number,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  return fromPushSourceWithBackPressure(
    getThingPropertyObserveFunction(property, interval),
  );
}


export function getThingPropertyObserveFunction<GValue extends IAsyncTaskConstraint<GValue>> (
  property: IThingProperty<GValue>,
  interval: number,
): IAsyncValueObserveFunction<GValue> {
  if (property.observe === void 0) {
    return createAsyncValueObserveFunctionFromReadFunction({
      read: property.read,
      interval,
    });
  } else {
    return mergePushSourceWithBackPressure([
      property.observe,
      createPushSourceWithBackPressureFromAsyncTaskFactory(property.read),
    ])
  }
}
