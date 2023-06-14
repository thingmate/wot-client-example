import { AsyncTask } from '@lirx/async-task';
import { openWebSocketMqttClient } from '@thingmate/mqtt';
import {
  IOpenWebSocketMqttClientOptions,
} from '@thingmate/mqtt/src/mqtt/client/standard/implementations/from-advanced-mqtt-client/web-socket/open-web-socket-mqtt-client';
import {
  IWebSocketMqttClient,
} from '@thingmate/mqtt/src/mqtt/client/standard/implementations/from-advanced-mqtt-client/web-socket/websocket-mqtt-client.type';

export interface IConnectTLSOptions {
  port: number;
  hostname: string;
  protocol?: string;
  caCerts?: string[];
}

export function getWebSocketProxyUrl(
  options: IConnectTLSOptions,
): URL {
  // const url = new URL(`ws://localhost:8081`);
  // const url = new URL(`ws://[2001:bc8:1828:325::1]:8081`);
  const url = new URL(`ws://51.15.108.162:8081`);
  url.searchParams.set('config', JSON.stringify(options));
  return url;
}

export function openWebSocketMqttClientWithoutCors(
  {
    url,
    ...options
  }: IOpenWebSocketMqttClientOptions,
): AsyncTask<IWebSocketMqttClient> {
  const _url: URL = new URL(url);

  return openWebSocketMqttClient({
    ...options,
    url: getWebSocketProxyUrl({
      hostname: _url.hostname,
      port: Number(_url.port),
      protocol: 'mqtt',
    }),
  });
}
