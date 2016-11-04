/* @flow */

function hexOctet(): string {
  return Math.floor(
    (1 + Math.random()) * 0x10000
  ).toString(16).substring(1);
}

export const CLASS_NAME = '_Installation';

export function generateId(): string {
  return (
    hexOctet() + hexOctet() + '-' +
    hexOctet() + '-' +
    hexOctet() + '-' +
    hexOctet() + '-' +
    hexOctet() + hexOctet() + hexOctet()
  );
}
