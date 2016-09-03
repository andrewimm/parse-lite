'use strict';

import {expect} from 'chai';
import deepCopy from '../src/deepCopy';

suite('deepCopy', () => {
  test('primitives', () => {
    expect(deepCopy(null)).to.equal(null);
    expect(deepCopy(12)).to.equal(12);
    expect(deepCopy('foo')).to.equal('foo');
    expect(deepCopy(false)).to.equal(false);
  });

  test('dates', () => {
    let d = new Date();
    let copy = deepCopy(d);
    expect(d).to.not.equal(copy);
    expect(d.getTime()).to.equal(copy.getTime());
  });

  test('arrays', () => {
    let arr = [1,3,5];
    let copy = deepCopy(arr);
    expect(copy).to.deep.equal([1,3,5]);
    expect(copy).to.not.equal(arr);

    arr = [1,2,[3,4,5]];
    copy = deepCopy(arr);
    expect(copy).to.deep.equal([1,2,[3,4,5]]);
    expect(copy).to.not.equal(arr);
    expect(copy[2]).to.not.equal(arr[2]);

    let a = ['a', 'b'];
    let b = [[a]];
    a[2] = b;
    expect(() => deepCopy(a)).to.throw();
  });

  test('objects', () => {
    let obj = {a: 1, b: 2};
    let copy = deepCopy(obj);
    expect(copy).to.deep.equal(obj);
    expect(copy).to.not.equal(obj);

    obj = {a: 1, b: {c: 5}};
    copy = deepCopy(obj);
    expect(copy).to.deep.equal(obj);
    expect(copy).to.not.equal(obj);
    expect(copy.b).to.not.equal(obj.b);
    expect(copy.b).to.not.equal(obj.b);

    obj = {a: 1, b: {c: {d: {e: 7}}}};
    copy = deepCopy(obj);
    expect(copy).to.deep.equal(obj);
    expect(copy).to.not.equal(obj);
    expect(copy.b).to.not.equal(obj.b);
    expect(copy.b.c).to.not.equal(obj.b.c);
    expect(copy.b.c.d).to.not.equal(obj.b.c.d);

    let a = {a: 1, b: 2};
    let b = {parent: a};
    a.child = b;
    expect(() => deepCopy(a)).to.throw();
  });
});
