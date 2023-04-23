import { IAsyncTaskConstraint } from '@lirx/async-task/src/async-task.class';
import { IDefaultNotificationsUnion, IObservable } from '@lirx/core';
import { IThingProperty, IThingPropertyObserveFunctionOptions, IThingValue } from '@thingmate/wot-scripting-api';
import { fromPushSourceWithBackPressure } from './from-push-source-with-back-pressure';

export function observeThingProperty<GValue extends IAsyncTaskConstraint<GValue, IThingValue>>(
  property: IThingProperty<GValue>,
  options?: IThingPropertyObserveFunctionOptions,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  return fromPushSourceWithBackPressure(property.observe(options));
}
