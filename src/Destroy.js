/* @flow */

import type App from './App';

import type {Identifier} from './Types';
import type {AuthOptions} from './Types';

export default function Destroy(
  app: App,
  className: string,
  object: Identifier,
  options: AuthOptions = {}
): Promise<any> {
  if (!object || (typeof object !== 'object' && typeof object !== 'string')) {
    return Promise.reject(new Error('Cannot destroy an invalid object'));
  }
  if (typeof object === 'object' && !object.objectId) {
    return Promise.reject(new Error('Cannot destroy an unsaved object'));
  }
  let id = typeof object === 'string' ? object : object.objectId;

  return app.client.delete(
    `classes/${className}/${id}`,
    null,
    options
  ).then(({response}) => {
    return response;
  });
}
