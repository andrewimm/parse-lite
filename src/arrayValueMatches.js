/**
 * Determines if two values in an Array field are equal,
 * used for atomic remove / addUnique ops
 */

export default function arrayValueMatches(a, b) {
  if (a === b) {
    return true;
  }
  if (a && b) {
    if (typeof a === 'object' && typeof b === 'object') {
      return a.objectId === b.objectId;
    }
  }
  return false;
}
