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
