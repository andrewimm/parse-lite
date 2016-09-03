/* @flow */

const toString = Object.prototype.toString;

export function isDate(obj: any): boolean {
  return toString.call(obj) === '[object Date]';
}
