/* @flow */

import arrayValueMatches from './arrayValueMatches';
import deepCopy from './deepCopy';

import type {Op, OpSet} from './Types';

type AttributeMap = {[key: string]: any};

/**
 * Set keys to specific values, or apply raw Ops
 */
export function set(obj: AttributeMap, changes: OpSet): AttributeMap {
  const result = {};
  const serverData = obj._serverData || {};
  for (let key in serverData) {
    result[key] = serverData[key];
  }
  Object.defineProperty(result, '_serverData', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: serverData
  });

  const opSet = obj._opSet || {};
  let existing = false;
  for (let key in obj) {
    result[key] = obj._serverData && obj._serverData.hasOwnProperty(key) ?
      obj._serverData[key] :
      obj[key];
    if (key === 'objectId') {
      existing = true;
    } else if (!obj._opSet && !obj._serverData) {
      opSet[key] = obj[key];
    }
  }

  for (let key in changes) {
    let op = changes[key];
    let source;
    if (op && op.__op) {
      switch (op.__op) {
        case 'Delete':
          delete result[key];
          if (existing) {
            opSet[key] = op;
          } else {
            delete opSet[key];
          }
          break;
        case 'Increment':
          let amount = isNaN(op.amount) ? 1 : op.amount;
          result[key] = (result[key] || 0) + amount;
          if (existing) {
            opSet[key] = op;
          } else {
            opSet[key] = result[key];
          }
          break;
        case 'Add':
          let toAdd = deepCopy(
            Array.isArray(op.objects) ? op.objects : [op.objects]
          );
          result[key] = (result[key] || []).concat(toAdd);
          if (existing) {
            opSet[key] = op;
          } else {
            opSet[key] = result[key];
          }
          break;
        case 'Remove':
          let toRemove = Array.isArray(op.objects) ? op.objects : [op.objects];
          let removed = [];
          source = result[key] || [];
          for (let i = 0; i < source.length; i++) {
            let matched = false;
            for (let j = 0; j < toRemove.length; j++) {
              if (matched) {
                continue;
              }
              if (arrayValueMatches(source[i], toRemove[j])) {
                matched = true;
              }
            }
            if (!matched) {
              removed.push(source[i]);
            }
          }
          result[key] = removed;
          if (existing) {
            opSet[key] = op;
          } else {
            opSet[key] = result[key];
          }
          break;
        case 'AddUnique':
          let toAddUnique = Array.isArray(op.objects) ? op.objects : [op.objects];
          let uniqueAdds = [];
          source = result[key] || [];
          for (let i = 0; i < toAddUnique.length; i++) {
            let matched = false;
            for (let j = 0; j < source.length; j++) {
              if (matched) {
                continue;
              }
              if (arrayValueMatches(toAddUnique[i], source[j])) {
                matched = true;
              }
            }
            if (!matched) {
              uniqueAdds.push(deepCopy(toAddUnique[i]));
            }
          }
          let merged = source.concat(uniqueAdds);
          result[key] = merged;
          if (existing) {
            opSet[key] = op;
          } else {
            opSet[key] = result[key];
          }
          break;
        default:
          throw new Error('Unsupported Op');
      }
    } else {
      // Standard set op
      result[key] = deepCopy(op);
      opSet[key] = deepCopy(op);
    }
  }
  Object.defineProperty(result, '_opSet', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: opSet
  });

  return result;
}

/**
 * Remove a field from an object
 */
export function unset(obj: AttributeMap, key: string): AttributeMap {
  return set(obj, { [key]: { __op: 'Delete' } });
}

/**
 * Atomically increment (or decrement) a numeric field
 */
export function increment(obj: AttributeMap, key: string, amount?: number): AttributeMap {
  const inc = typeof amount === 'number' ? amount : 1;
  return set(obj, { [key]: { __op: 'Increment', amount: inc } });
}

/**
 * Atomically add elements to an Array field
 */
export function add(obj: AttributeMap, key: string, objects: any): AttributeMap {
  if (!Array.isArray(objects)) {
    objects = [objects];
  }
  return set(obj, { [key]: { __op: 'Add', objects: objects } });
}

/**
 * Atomically add elements to an Array field, if they don't already exist
 */
export function addUnique(obj: AttributeMap, key: string, objects: any): AttributeMap {
  if (!Array.isArray(objects)) {
    objects = [objects];
  }
  return set(obj, { [key]: { __op: 'AddUnique', objects: objects } });
}

/**
 * Atomically remove elements from an Array field
 */
export function remove(obj: AttributeMap, key: string, objects: any): AttributeMap {
  if (!Array.isArray(objects)) {
    objects = [objects];
  }
  return set(obj, { [key]: { __op: 'Remove', objects: objects } });
}

/**
 * Client-side operation to revert all unsaved changes
 */
export function revert(obj: AttributeMap, key: string): AttributeMap {
  if (!obj._serverData) {
    return {};
  }
  const original = {};
  Object.defineProperty(original, '_serverData', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: obj._serverData
  });
  Object.defineProperty(original, '_opSet', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: {}
  });
  for (let key in obj._serverData) {
    original[key] = obj._serverData[key];
  }
  return original;
}
