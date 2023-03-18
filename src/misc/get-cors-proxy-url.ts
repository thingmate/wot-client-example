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
