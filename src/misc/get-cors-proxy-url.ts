import { Abortable, asyncFetchJSON, AsyncTask, IAsyncFetchRequestInit, IAsyncTaskConstraint } from '@lirx/async-task';

export function getCorsProxyUrl(
  url: URL | string,
): URL {
  // const _url = new URL('https://cors.deno.dev');
  // const _url = new URL('https://cors-anywhere.herokuapp.com/');
  // _url.pathname = url.toString();
  const _url = new URL(`http://51.15.108.162:8082`);
  _url.searchParams.set('url', url.toString());
  return _url;
}

export function asyncFetchJSONWithoutCORS<GData extends IAsyncTaskConstraint<GData>>(
  input: RequestInfo | URL,
  init: IAsyncFetchRequestInit,
  abortable: Abortable,
): AsyncTask<GData> {
  if (input instanceof Request) {
    return AsyncTask.fromFactory(() => input.blob(), abortable)
      .successful((body: Blob, abortable: Abortable) => {
        const _init: RequestInit = {};
        for (const property in input) {
          _init[property] = input[property];
        }
        return asyncFetchJSON(
          new Request(getCorsProxyUrl(input.url), {
            ..._init,
            body,
          }),
          init,
          abortable,
        );
      });
  } else {
    throw new Error(`Unsupported`);
  }
}
