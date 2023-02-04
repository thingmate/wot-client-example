import type * as Http from '@node-wot/binding-http';
import type * as WebSocket from '@node-wot/binding-websockets';
import type * as Core from '@node-wot/core';

export interface IWoTBundle {
  Core: typeof Core,
  Http: typeof Http,
  WebSocket: typeof WebSocket,
}

declare const Wot: IWoTBundle;

function loadScript(
  url: string,
  async: boolean = true,
  type: string = 'text/javascript',
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const scriptElement: HTMLScriptElement = document.createElement('script');

    scriptElement.type = type;
    scriptElement.async = async;
    scriptElement.src = url;

    const end = (): void => {
      scriptElement.removeEventListener('load', load);
      scriptElement.removeEventListener('error', error);
    };

    const load = (): void => {
      end();
      resolve();
    };

    const error = (): void => {
      end();
      reject(new Error(`Failed to load the script ${url}`));
    };

    scriptElement.addEventListener('load', load);

    scriptElement.addEventListener('error', error);

    document.head.appendChild(scriptElement);
  });
}

export function getWoTBundle(): Promise<IWoTBundle> {
  return loadScript('https://cdn.jsdelivr.net/npm/@node-wot/browser-bundle@latest/dist/wot-bundle.min.js')
    .then(() => Wot);
}
