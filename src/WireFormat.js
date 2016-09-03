/**
 * Allows objects to be built from or encoded to the wire format used by the
 * Parse-Server to represent complex data types.
 * @flow
 */

import {isDate} from './Date';

import type {
  GeoPoint,
  ParseFile,
  ParseValue,
  Pointer,
  WireFormatDate,
} from './Types';

export function encode(data: any, forcePointer?: boolean): ?ParseValue {
  if (
    typeof data === 'undefined' ||
    typeof data === 'boolean' ||
    typeof data === 'string' ||
    typeof data === 'number'
  ) {
    return data;
  }
  if (data === null) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(encode);
  }
  if (isDate(data)) {
    const date: WireFormatDate = {
      __type: 'Date',
      iso: data.toJSON()
    };
    return date;
  }
  if (data.__type) {
    if (data.__type === 'File') {
      const file: ParseFile = {
        __type: 'File',
        name: data.name,
        url: data.url,
      };
    }
    if (data.__type === 'GeoPoint') {
      const point: GeoPoint = {
        __type: 'GeoPoint',
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
  }
  if (data.hasOwnProperty('latitude') &&
      data.hasOwnProperty('longitude') &&
      Object.keys(data).length === 2) {
    const point: GeoPoint = {
      __type: 'GeoPoint',
      latitude: data.latitude,
      longitude: data.longitude,
    };
    return point;
  }
  if (data.objectId) {
    if (data._className) {
      if (forcePointer) {
        const pointer: Pointer = {
          __type: 'Pointer',
          objectId: data.objectId,
          className: data._className
        };
        return pointer;
      }
    }
  }
  let encoded = {};
  for (let key in data) {
    encoded[key] = encode(data[key], true);
  }
  return encoded;
}

export function decode(data: any): ?ParseValue {
  if (
    typeof data === 'undefined' ||
    typeof data === 'boolean' ||
    typeof data === 'string' ||
    typeof data === 'number'
  ) {
    return data;
  }
  if (data === null) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map(decode);
  }
  if (data.__type === 'Date') {
    return new Date(data.iso);
  }
  const decoded = {};
  if (data.__type) {
    Object.defineProperty(decoded, '__type', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: data.__type,
    });
  }
  for (let key in data) {
    if (key === 'createdAt' || key === 'updatedAt') {
      if (typeof data[key] === 'string') {
        const date = new Date(data[key]);
        if (!isNaN(date)) {
          decoded[key] = date;
          continue;
        }
      }
    }
    if (key !== '__type') {
      decoded[key] = decode(data[key])
    }
  }
  return decoded;
}
