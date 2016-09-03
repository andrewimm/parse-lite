/**
 * Create a shallow copy of an object that excludes certain fields.
 * This ensures that they're "forgotten" from both the object and
 * its private serverData.
 *
 * @flow
 */

import type {ParseObject} from './Types';

export default function copyWithoutFields(
  object: ParseObject,
  fields: Array<string>
): ParseObject {
  const copy = {};
  for (let key in object) {
    if (fields.indexOf(key) < 0) {
      copy[key] = object[key];
    }
  }
  if (object.hasOwnProperty('_serverData')) {
    Object.defineProperty(copy, '_serverData', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: object._serverData,
    });
  }
  if (object.hasOwnProperty('_className')) {
    Object.defineProperty(copy, '_className', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: object._className,
    });
  }
  if (object.hasOwnProperty('_opSet')) {
    Object.defineProperty(copy, '_opSet', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: object._opSet,
    });
  }

  return copy;
}
