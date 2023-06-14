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

function forgeNoCorsRequest(
  input: RequestInfo | URL,
  init: IAsyncFetchRequestInit,
  abortable: Abortable,
): AsyncTask<Request> {
  if (input instanceof Request) {
    return AsyncTask.fromFactory(() => {
      return (input.body === null)
        ? null
        : input.blob();
    }, abortable)
      .successful((body: Blob | null): Request => {
        const _init: RequestInit = {};
        for (const property in input) {
          _init[property] = input[property];
        }
        return new Request(getCorsProxyUrl(input.url), {
          ..._init,
          body,
        });
      });
  } else if (
    (typeof input === 'string')
    || (input instanceof URL)
  ) {
    return AsyncTask.fromFactory((): Request => {
      return new Request(getCorsProxyUrl(input), init);
    }, abortable);
  } else {
    throw new Error(`Unsupported`);
  }
}

export function asyncFetchJSONWithoutCors<GData extends IAsyncTaskConstraint<GData>>(
  input: RequestInfo | URL,
  init: IAsyncFetchRequestInit,
  abortable: Abortable,
): AsyncTask<GData> {
  return forgeNoCorsRequest(input, init, abortable)
    .successful((request: Request, abortable: Abortable): AsyncTask<GData> => {
      return asyncFetchJSON<GData>(
        request,
        init,
        abortable,
      );
    });
}
