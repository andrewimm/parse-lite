'use strict';

import {expect} from 'chai';
import arrayValueMatches from '../src/arrayValueMatches';

suite('arrayValueMatches', () => {
  test('primitive equality', () => {
    expect(arrayValueMatches(0, 0)).to.be.true;
    expect(arrayValueMatches(0, 1)).to.be.false;
    expect(arrayValueMatches(0, null)).to.be.false;
    expect(arrayValueMatches(null, null)).to.be.true;
    expect(arrayValueMatches(undefined, undefined)).to.be.true;
    expect(arrayValueMatches(2, '2')).to.be.false;
    expect(arrayValueMatches('2', '2')).to.be.true;
  });

  test('object equality', () => {
    let a = {objectId: 'a'};
    let b = {objectId: 'b'};
    let a2 = {objectId: 'a'};
    expect(arrayValueMatches(a, a)).to.be.true;
    expect(arrayValueMatches(a, b)).to.be.false;
    expect(arrayValueMatches(a, a2)).to.be.true;
  });
});
