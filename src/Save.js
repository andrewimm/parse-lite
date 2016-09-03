/* @flow */

import {decode, encode} from './WireFormat';
import deepCopy from './deepCopy';
import * as Ops from './Ops';

import type App from './App';
import type {AuthOptions, ParseObject} from './Types';

export default function Save(
  app: App,
  className: string,
  object: ParseObject,
  options: AuthOptions = {}
): Promise<ParseObject> {
  if (!object || typeof object !== 'object') {
    return Promise.reject(new Error('Cannot save an invalid object'));
  }
  if (!object._opSet) {
    object = Ops.set(object, {});
  }
  const method = object.objectId ? 'PUT' : 'POST';
  if (object.objectId && typeof object.objectId !== 'string') {
    throw new Error('Invalid id: objectId field must be a string');
  }
  const path = object.objectId ?
    `classes/${className}/${object.objectId}` :
    `classes/${className}`;
  return app.client.raw(
    method,
    path,
    encode(object._opSet),
    options
  ).then((response) => {
    const result = response.response;
    const savedServerData = {};
    const setFields = {};
    for (let key in object._opSet) {
      if (!object._opSet[key] || !object._opSet[key].__op) {
        setFields[key] = object._opSet[key];
      }
    }
    if (object.objectId) {
      setFields.objectId = object.objectId;
    }
    Object.assign(
      savedServerData,
      deepCopy(object._serverData || {}),
      setFields,
      decode(result)
    );
    const savedObject = {};
    Object.assign(
      savedObject,
      deepCopy(object._serverData || {}),
      setFields,
      decode(result)
    );
    Object.defineProperty(savedObject, '_serverData', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: savedServerData,
    });
    Object.defineProperty(savedObject, '_className', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: className,
    });
    Object.defineProperty(savedObject, '_opSet', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: {},
    });
    return savedObject;
  });
}
