/* @flow */

export type GeoPoint = {
  __type: 'GeoPoint',
  latitude: number,
  longitude: number;
};

export type ParseFile = {
  __type: 'File',
  name: string,
  url: string,
};

export type Pointer = {
  __type: 'Pointer',
  objectId: string,
  className: string,
};

export type WireFormatDate = {
  __type: 'Date',
  iso: string,
};

export type AuthOptions = {
  sessionToken?: string,
  useMasterKey?: boolean,
};

export type Identifier = string | {objectId: string, [key: string]: any};
export type ByteString = string;
export type Comparable = number | string | Date;
export type ParseScalar = string | number | boolean | GeoPoint | ParseFile | Pointer | Date;
export type ParseMap = { [key: string]: ?ParseScalar | ParseMap | ParseVector };
export type ParseVector = Array<ParseScalar | ParseMap | ParseVector>;

export type ParseValue = ParseScalar | ParseMap | ParseVector;

export type ParseObject = {
  _serverData?: ParseMap,
  _opSet?: OpSet,
  _className?: string,
  [key: string]: ?ParseScalar | ParseMap | ParseVector,
};

export type Op = { __op: 'Unset' }
  | { __op: 'Increment', amount: number }
  | { __op: 'Add', objects: Array<any> };

export type OpSet = {
  [field: string]: Op,
};
