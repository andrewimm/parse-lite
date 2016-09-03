import {isDate} from './Date';

export default function deepCopy(obj, seen = []) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  if (isDate(obj)) {
    return new Date(obj.getTime());
  }
  if (seen.indexOf(obj) > -1) {
    throw new Error('Cannot copy circular object references');
  }
  let newSeen = seen.concat([obj]);
  if (Array.isArray(obj)) {
    return obj.map(el => deepCopy(el, newSeen));
  }
  let copy = {};
  for (let k in obj) {
    copy[k] = deepCopy(obj[k], newSeen);
  }
  return copy;
}
