import { IAsyncTaskConstraint } from '@lirx/async-task/';
import { IDefaultNotificationsUnion, IObservable } from '@lirx/core';
import { IThingPropertyObserveFunctionOptions, IThingValue, ThingProperty } from '@thingmate/wot-scripting-api';
import { fromPushSourceWithBackPressure } from './from-push-source-with-back-pressure';

export function observeThingProperty<GValue extends IAsyncTaskConstraint<GValue, IThingValue>>(
  property: ThingProperty<GValue>,
  options?: IThingPropertyObserveFunctionOptions,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  return fromPushSourceWithBackPressure(property.observe(options));
}
