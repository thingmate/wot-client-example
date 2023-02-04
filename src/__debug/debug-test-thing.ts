import { createConsumedThingFromThingDescription, fetchTD, IConsumedThing, IWoT } from '@thingmate/wot-scripting-api';

export async function debugTestThing(WoT: IWoT) {
  const td = await fetchTD('http://localhost:8080/test-thing');
  const thing: IConsumedThing = await createConsumedThingFromThingDescription(WoT, td);

  const testStateProperty = async () => {
    const stateProperty = thing.getProperty<boolean>('state');

    // const observer = await stateProperty.observe();

    // const readObserver = () => {
    //   observer.onValue((state: boolean) => {
    //     console.log('observed state', state);
    //   });
    // };
    //
    // const readObserverWithAsyncIterator = async () => {
    //   const iterable = observer[Symbol.asyncIterator]();
    //   let result: IteratorResult<boolean>;
    //   while (!(result = await iterable.next()).done) {
    //     console.log('observed state', result.value);
    //   }
    //   console.log('observer stopped');
    // };

    // readObserver();
    // readObserverWithAsyncIterator();

    await stateProperty.write(true);
    console.log('read state', await stateProperty.read());
    await stateProperty.write(false);
    console.log('read state', await stateProperty.read());

    // await observer.stop();
  };

  const testToggleAction = async () => {
    const toggleAction = thing.getAction<boolean, boolean>('toggle');

    console.log('toggle action', await toggleAction.invoke());
  };

  const testOnToggleEvent = async () => {
    const stateChangeEvent = thing.getEvent<boolean>('state-change');

    const observer = await stateChangeEvent.observe();

    observer.onValue((state: boolean) => {
      console.log('observed event state-change', state);
    });

    const toggleAction = thing.getAction<boolean, boolean>('toggle');
    await toggleAction.invoke();

    await observer.stop();
  };

  await testStateProperty();
  await testToggleAction();
  await testOnToggleEvent();
}
