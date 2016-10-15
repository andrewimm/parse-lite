/* @flow */

import {decode, encode} from './WireFormat';
import deepCopy from './deepCopy';

import type App from './App';
import type {
  AuthOptions,
  Comparable,
  GeoPoint,
  ParseObject,
  ParseValue,
  ParseVector,
} from './Types';

type WhereClause = {
  [attr: string]: any;
};

type QueryJSON = {
  where: WhereClause;
  include: Array<string>;
  keys: ?Array<string>;
  limit: number;
  skip: number;
  order: Array<string>;
  count?: number;
  className?: string;
};

const CONSTRAINTS = {
  $neq: true,
  $lt: true,
  $lte: true,
  $gt: true,
  $gte: true,
  $in: true,
  $nin: true,
  $all: true,
  $exists: true,
  $regex: true,
  $options: true,
  $inQuery: true,
  $notInQuery: true,
  $select: true,
  $dontSelect: true,
  $nearSphere: true,
  $within: true,
};

function isConstraint(value: Object): boolean {
  for (let c in CONSTRAINTS) {
    if (value.hasOwnProperty(c)) {
      return true;
    }
  }
  return false;
}

function quote(s: string): string {
  return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
}

export function emptyQuery(): QueryJSON {
  return {
    where: {},
    order: [],
    limit: -1,
    skip: 0,
    keys: null,
    include: [],
  };
}

function copyQuery(q: QueryJSON): QueryJSON {
  const copy = {
    where: q.where ? deepCopy(q.where) : {},
    order: q.order ? [].concat(q.order) : [],
    limit: q.hasOwnProperty('limit') ? q.limit : -1,
    skip: q.skip || 0,
    keys: q.keys ? [].concat(q.keys) : null,
    include: q.include ? [].concat(q.include) : [],
  };
  return copy;
}

function copyWithNewConstraint(
  q: QueryJSON,
  field: string,
  constraint: string,
  value: any
): QueryJSON {
  const copy = copyQuery(q);
  const encoded = encode(value, true);
  if (copy.where.hasOwnProperty(field)) {
    if (!isConstraint(copy.where[field])) {
      copy.where[field] = {};
    }
  } else {
    copy.where[field] = {};
  }
  copy.where[field][constraint] = encoded;
  return copy;
}

export function equalTo(q: QueryJSON, field: string, value: any): QueryJSON {
  if (typeof value === 'undefined') {
    return doesNotExist(q, field);
  }
  const copy = copyQuery(q);
  copy.where[field] = encode(value);
  return copy;
}

export function notEqualTo(q: QueryJSON, field: string, value: any): QueryJSON {
  return copyWithNewConstraint(q, field, '$neq', value);
}

export function lessThan(q: QueryJSON, field: string, value: Comparable): QueryJSON {
  return copyWithNewConstraint(q, field, '$lt', value);
}

export function lessThanOrEqualTo(q: QueryJSON, field: string, value: Comparable): QueryJSON {
  return copyWithNewConstraint(q, field, '$lte', value);
}

export function greaterThan(q: QueryJSON, field: string, value: Comparable): QueryJSON {
  return copyWithNewConstraint(q, field, '$gt', value);
}

export function greaterThanOrEqualTo(q: QueryJSON, field: string, value: Comparable): QueryJSON {
  return copyWithNewConstraint(q, field, '$gte', value);
}

export function containedIn(q: QueryJSON, field: string, value: any): QueryJSON {
  return copyWithNewConstraint(q, field, '$in', value);
}

export function notContainedIn(q: QueryJSON, field: string, value: any): QueryJSON {
  return copyWithNewConstraint(q, field, '$nin', value);
}

export function containsAll(q: QueryJSON, field: string, value: any): QueryJSON {
  return copyWithNewConstraint(q, field, '$all', value);
}

export function exists(q: QueryJSON, field: string): QueryJSON {
  return copyWithNewConstraint(q, field, '$exists', true);
}

export function doesNotExist(q: QueryJSON, field: string): QueryJSON {
  return copyWithNewConstraint(q, field, '$exists', false);
}

export function matches(q: QueryJSON, field: string, regex: RegExp, modifiers: string = ''): QueryJSON {
  const copy = copyWithNewConstraint(q, field, '$regex', regex);
  if (regex.ignoreCase) {
    modifiers += 'i';
  }
  if (regex.multiline) {
    modifiers += 'm';
  }
  if (modifiers.length) {
    copy.where[field].$options = modifiers;
  }
  return copy;
}

export function matchesQuery(q: QueryJSON, field: string, className: string, query: QueryJSON): QueryJSON {
  return copyWithNewConstraint(q, field, '$inQuery', {...query, className});
}

export function doesNotMatchQuery(q: QueryJSON, field: string, className: string, query: QueryJSON): QueryJSON {
  return copyWithNewConstraint(q, field, '$notInQuery', {...query, className});
}

export function matchesKeyInQuery(q: QueryJSON, field: string, className: string, query: QueryJSON, queryKey: string): QueryJSON {
  return copyWithNewConstraint(q, field, '$select', {
    key: queryKey,
    query: {...query, className},
  });
}

export function doesNotMatchKeyInQuery(q: QueryJSON, field: string, className: string, query: QueryJSON, queryKey: string): QueryJSON {
  return copyWithNewConstraint(q, field, '$dontSelect', {
    key: queryKey,
    query: {...query, className},
  });
}

export function contains(q: QueryJSON, field: string, value: string): QueryJSON {
  if (typeof value !== 'string') {
    throw new Error('The value being searched for must be a string.');
  }
  return copyWithNewConstraint(q, field, '$regex', quote(value));
}

export function startsWith(q: QueryJSON, field: string, value: string): QueryJSON {
  if (typeof value !== 'string') {
    throw new Error('The value being searched for must be a string.');
  }
  return copyWithNewConstraint(q, field, '$regex', '^' + quote(value));
}

export function endsWith(q: QueryJSON, field: string, value: string): QueryJSON {
  if (typeof value !== 'string') {
    throw new Error('The value being searched for must be a string.');
  }
  return copyWithNewConstraint(q, field, '$regex', quote(value) + '$');
}

export function near(q: QueryJSON, field: string, point: GeoPoint): QueryJSON {
  return copyWithNewConstraint(q, field, '$nearSphere', point);
}

export function withinRadians(q: QueryJSON, field: string, point: GeoPoint, distance: number): QueryJSON {
  const copy = copyWithNewConstraint(q, field, '$nearSphere', point);
  copy.where[field].$maxDistance = distance;
  return copy;
}

export function withinMiles(q: QueryJSON, field: string, point: GeoPoint, distance: number): QueryJSON {
  return withinRadians(q, field, point, distance / 3958.8);
}

export function withinKilometers(q: QueryJSON, field: string, point: GeoPoint, distance: number): QueryJSON {
  return withinRadians(q, field, point, distance / 6371.0);
}

export function withinGeoBox(q: QueryJSON, field: string, southwest: GeoPoint, northeast: GeoPoint): QueryJSON {
  return copyWithNewConstraint(q, field, '$within', {
    $box: [southwest, northeast]
  });
}

export function ascending(q: QueryJSON, ...keys: Array<string>): QueryJSON {
  const copy = copyQuery(q);
  copy.order = keys.map((k) => {
    if (typeof k !== 'string') {
      throw new Error('Ascending should only take strings as secondary arguments');
    }
    return k;
  });
  return copy;
}

export function descending(q: QueryJSON, ...keys: Array<string>): QueryJSON {
  const copy = copyQuery(q);
  copy.order = keys.map((k) => {
    if (typeof k !== 'string') {
      throw new Error('Descending should only take strings as secondary arguments');
    }
    return '-' + k;
  });
  return copy;
}

export function skip(q: QueryJSON, n: number): QueryJSON {
  if (typeof n !== 'number' || n < 0) {
    throw new Error('You can only skip by a positive number');
  }
  const copy = copyQuery(q);
  copy.skip = n;
  return copy;
}

export function limit(q: QueryJSON, n: number): QueryJSON {
  if (typeof n !== 'number' || n < 0) {
    throw new Error('You can only skip by a positive number');
  }
  const copy = copyQuery(q);
  copy.limit = n;
  return copy;
}

export function include(q: QueryJSON, ...keys: Array<string>): QueryJSON {
  const copy = copyQuery(q);
  copy.include = keys;
  return copy;
}

export function select(q: QueryJSON, ...keys: Array<string>): QueryJSON {
  throw new Error('not yet implemented');
}

export function or(...queries: Array<QueryJSON>): QueryJSON {
  if (queries.length === 0) {
    throw new Error('At least one input query is required');
  }

  let q = emptyQuery();
  q.where = {
    $or: [queries.map((q) => deepCopy(q.where))]
  };
  return q;
}

export function find(
  app: App,
  className: string,
  q: QueryJSON,
  options: AuthOptions = {}
): Promise<Array<ParseObject>> {
  const filtered: Object = {
    where: q.where,
  };
  if (q.order && q.order.length) {
    filtered.order = q.order.join(',');
  }
  if (q.limit > -1) {
    filtered.limit = q.limit;
  }
  if (q.skip > 0) {
    filtered.skip = q.skip;
  }
  if (q.keys && q.keys.length) {
    filtered.keys = q.keys.join(',');
  }
  if (q.include && q.include.length) {
    filtered.include = q.include.join(',');
  }
  return app.client.get(
    `classes/${className}`,
    filtered,
    options
  ).then((response) => {
    const results = response.response.results;
    const objects = results.map((r) => {
      if (!r) {
        return r;
      }
      const obj: ParseObject = (decode(r): any);
      Object.defineProperty(obj, '_serverData', {
        enumerable: false,
        writeable: false,
        configurable: false,
        value: (decode(r): any),
      });
      Object.defineProperty(obj, '_className', {
        enumerable: false,
        writeable: false,
        configurable: false,
        value: className,
      });
      return obj;
    });
    return objects;
  });
}

export function get(
  app: App,
  className: string,
  objectId: string,
  options: AuthOptions = {}
): Promise<ParseObject> {
  return app.client.get(
    `classes/${className}/${objectId}`,
    {},
    options
  ).then((response) => {
    const result = response.response;
    if (!result) {
      return result;
    }
    const obj: ParseObject = (decode(result): any);
    Object.defineProperty(obj, '_serverData', {
      enumerable: false,
      writeable: false,
      configurable: false,
      value: (decode(result): any),
    });
    Object.defineProperty(obj, '_className', {
      enumerable: false,
      writeable: false,
      configurable: false,
      value: className,
    });
    return obj;
  });
};
