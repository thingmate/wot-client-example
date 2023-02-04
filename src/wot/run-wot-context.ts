import { IWoT } from '@thingmate/wot-scripting-api';
import { getWoTBundle } from './get-wot-bundle';

export interface IWoTContext<GReturn> {
  (
    WoT: IWoT,
  ): GReturn;
}

export function runWoTContext<GReturn>(
  context: IWoTContext<GReturn>,
): Promise<Awaited<GReturn>> {
  return getWoTBundle()
    .then((wotBundle) => {
      const servient = new wotBundle.Core.Servient();
      servient.addClientFactory(new wotBundle.Http.HttpClientFactory());
      servient.addClientFactory(new wotBundle.WebSocket.WebSocketClientFactory());
      return servient.start().then(context) as Promise<Awaited<GReturn>>;
    });
}
