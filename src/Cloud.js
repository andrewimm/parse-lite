/* @flow */

import {decode, encode} from './WireFormat';

import type App from './App';

type CloudResponse = {
  result?: any,
};

export default function Cloud(app: App, name: string, data: any = {}): Promise<any> {
  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Cloud function name must be a string.');
  }

  const payload = encode(data);

  return app.client.post(
    'functions/' + name,
    payload,
    {}
  ).then(({response}) => {
    const decoded: CloudResponse = (decode(response): any);
    if (decoded && decoded.hasOwnProperty('result')) {
      return Promise.resolve(decoded.result);
    }
    return Promise.reject('The server returned an invalid response.');
  }).catch(({response}) => {
    return Promise.reject(response);
  });
}
