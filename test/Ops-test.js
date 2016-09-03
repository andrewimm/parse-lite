'use strict';
import {expect} from 'chai';
import * as Ops from '../src/Ops';

suite('Ops', () => {
  test('set', () => {
    let result = Ops.set({ a: 5 }, { b: 'str' });
    expect(Object.keys(result)).to.deep.equal(['a', 'b']);
    expect(result.a).to.equal(5);
    expect(result.b).to.equal('str');
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ a: 5, b: 'str' });

    result = Ops.set(result, { c: false });
    expect(result.c).to.equal(false);
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ a: 5, b: 'str', c: false });

    result = Ops.set(result, { b: 'str2' });
    expect(result.b).to.equal('str2');
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ a: 5, b: 'str2', c: false });
  });

  test('set on existing objects', () => {
    let result = Ops.set({ objectId: 'abc' }, { b: 'str' });
    expect(result.objectId).to.equal('abc');
    expect(result.b).to.equal('str');
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ b: 'str' });
  });

  test('implicit set has no effect', () => {
    let obj = { objectId: 'abc', a: 4 };
    Object.defineProperty(obj, '_serverData', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: { a: 4 },
    });
    obj.a = 5;
    let result = Ops.set(obj, {});
    expect(result.objectId).to.equal('abc');
    expect(result.a).to.equal(4);
    expect(result._serverData).to.deep.equal({ a: 4 });
    expect(result._opSet).to.be.empty;

    obj = { objectId: 'abc', a: 4 };
    Object.defineProperty(obj, '_serverData', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: { a: 4 },
    });
    obj.a = 5;
    result = Ops.set(obj, { b: 6 });
    expect(result.objectId).to.equal('abc');
    expect(result.a).to.equal(4);
    expect(result.b).to.equal(6);
    expect(result._serverData).to.deep.equal({ a: 4 });
    expect(result._opSet).to.deep.equal({ b: 6 });
  });

  test('set is not vulnerable to side effects', () => {
    let obj = { a: 5 };
    let result = Ops.set({ objectId: 'abc' }, { obj: obj });
    expect(result.obj).to.deep.equal({ a: 5 });
    obj.a = 12;
    expect(result.obj).to.deep.equal({ a: 5 });
  });

  test('unset', () => {
    let result = Ops.unset({ a: 5, b: 7 }, 'a');
    expect(result).to.not.have.property('a');
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ b: 7 });

    result = Ops.unset(result, 'b');
    expect(result).to.not.have.property('b');
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.be.empty;
  });

  test('unset on existing objects', () => {
    let result = Ops.unset({ objectId: 'abc' }, 'a');
    expect(result._opSet).to.deep.equal({ a: { __op: 'Delete' }});

    let obj = { objectId: 'abc', a: 4, b: 6 };
    Object.defineProperty(obj, '_serverData', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: { a: 4, b: 6 },
    });
    result = Ops.unset(obj, 'a');
    expect(result).to.not.have.property('a');
    expect(result._opSet).to.deep.equal({ a: { __op: 'Delete' }});
    expect(result._serverData).to.deep.equal({ a: 4, b: 6 });
  });

  test('increment', () => {
    let result = Ops.increment({ a: 5 }, 'a');
    expect(result.a).to.equal(6);
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ a: 6 });

    result = Ops.increment(result, 'a', 10);
    expect(result.a).to.equal(16);
    expect(result._serverData).to.be.empty;
    expect(result._opSet).to.deep.equal({ a: 16 });
  });

  test('add', () => {
    let result = Ops.add({ tags: ['a', 'b'] }, 'tags', 'c');
    expect(result.tags).to.deep.equal(['a', 'b', 'c']);

    result = Ops.add(result, 'tags', ['d', 'e', 'f']);
    expect(result.tags).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  test('remove', () => {
    let result = Ops.remove({ tags: ['a', 'b', 'c', 'd', 'e', 'f'] }, 'tags', 'a');
    expect(result.tags).to.deep.equal(['b', 'c', 'd', 'e', 'f']);

    result = Ops.remove(result, 'tags', 'b');
    expect(result.tags).to.deep.equal(['c', 'd', 'e', 'f']);

    result = Ops.remove(result, 'tags', 'f');
    expect(result.tags).to.deep.equal(['c', 'd', 'e']);

    result = Ops.remove(result, 'tags', ['d', 'e']);
    expect(result.tags).to.deep.equal(['c']);

    result = Ops.remove(result, 'tags', ['c', 'e']);
    expect(result.tags).to.deep.equal([]);
  });

  test('add unique', () => {
    let result = Ops.addUnique({ tags: ['a', 'b'] }, 'tags', 'c');
    expect(result.tags).to.deep.equal(['a', 'b', 'c']);

    result = Ops.addUnique(result, 'tags', ['d', 'e', 'b']);
    expect(result.tags).to.deep.equal(['a', 'b', 'c', 'd', 'e']);

    result = Ops.addUnique(result, 'tags', ['d', 'e']);
    expect(result.tags).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
  });

  test('array operations are not vulnerable to side effects', () => {
    let a = {a: 5};
    let b = {b: 10};
    let original = {arr: [a]};
    let result = Ops.add(original, 'arr', b);
    expect(result.arr[0]).to.deep.equal({a: 5});
    expect(result.arr[1]).to.deep.equal({b: 10});
    b.b = 20;
    expect(result.arr[1]).to.deep.equal({b: 10});
  });
});
