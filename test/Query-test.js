'use strict';

import {expect} from 'chai';
import * as Query from '../src/Query';

class App {
  constructor() {}
}

suite('Query', () => {
  test('equal to', () => {
    let q = Query.emptyQuery();
    let eq = Query.equalTo(q, 'foo', 'bar');
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({foo: 'bar'});

    eq = Query.equalTo(eq, 'foo', 'baz');
    expect(eq.where).to.deep.equal({foo: 'baz'});

    eq = Query.equalTo(eq, 'count', 10);
    expect(eq.where).to.deep.equal({foo: 'baz', count: 10});
  });

  test('not equal to', () => {
    let q = Query.emptyQuery();
    let eq = Query.notEqualTo(q, 'foo', 'bar');
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({foo: {$ne: 'bar'}});

    eq = Query.equalTo(eq, 'foo', 'bar');
    expect(eq.where).to.deep.equal({foo: 'bar'});
    eq = Query.notEqualTo(eq, 'foo', 'baz');
    expect(eq.where).to.deep.equal({foo: {$ne: 'baz'}});
  });

  test('less than', () => {
    let q = Query.emptyQuery();
    let eq = Query.lessThan(q, 'count', 10);

    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({count: {$lt: 10}});

    eq = Query.notEqualTo(eq, 'count', 3);
    eq = Query.lessThan(eq, 'count', 5);
    expect(eq.where).to.deep.equal({count: {$ne: 3, $lt: 5}});
  });

  test('greater than', () => {
    let q = Query.emptyQuery();
    let eq = Query.greaterThan(q, 'count', 0);
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({count: {$gt: 0}});

    eq = Query.lessThan(eq, 'count', 10);
    eq = Query.greaterThan(eq, 'count', 5);
    expect(eq.where).to.deep.equal({count: {$lt: 10, $gt: 5}});
  });

  test('less than or equal to', () => {
    let q = Query.emptyQuery();
    let eq = Query.lessThanOrEqualTo(q, 'count', 10);
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({count: {$lte: 10}});
  });

  test('greater than or equal to', () => {
    let q = Query.emptyQuery();
    let eq = Query.greaterThanOrEqualTo(q, 'count', 10);
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({count: {$gte: 10}});
  });

  test('contained in', () => {
    let q = Query.emptyQuery();
    let eq = Query.containedIn(q, 'tags', 'abc');
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({tags: {$in: 'abc'}});
  });

  test('notContainedIn', () => {
    let q = Query.emptyQuery();
    let eq = Query.notContainedIn(q, 'tags', 'abc');
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({tags: {$nin: 'abc'}});
  });

  test('contains all', () => {
    let q = Query.emptyQuery();
    let eq = Query.containsAll(q, 'tags', ['abc', 'def']);
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({tags: {$all: ['abc', 'def']}});
  });

  test('exists', () => {
    let q = Query.emptyQuery();
    let eq = Query.exists(q, 'prop');
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({prop: {$exists: true}});
  });

  test('does not exist', () => {
    let q = Query.emptyQuery();
    let eq = Query.doesNotExist(q, 'prop');
    expect(q).to.not.equal(eq);
    expect(q.where).to.deep.equal({});
    expect(eq.where).to.deep.equal({prop: {$exists: false}});
  });

  test('ascending order', () => {
    let q = Query.emptyQuery();
    let eq = Query.exists(q, 'prop');
    eq = Query.ascending(eq, 'count');
    expect(q).to.not.equal(eq);
    expect(eq.order).to.deep.equal(['count']);
    expect(eq.where).to.deep.equal({prop: {$exists: true}});

    eq = Query.ascending(eq, 'count', 'level');
    expect(eq.order).to.deep.equal(['count', 'level']);
  });

  test('descending order', () => {
    let q = Query.emptyQuery();
    let eq = Query.exists(q, 'prop');
    eq = Query.descending(eq, 'count');
    expect(q).to.not.equal(eq);
    expect(eq.order).to.deep.equal(['-count']);
    expect(eq.where).to.deep.equal({prop: {$exists: true}});

    eq = Query.descending(eq, 'count', 'level');
    expect(eq.order).to.deep.equal(['-count', '-level']);
  });

  test('skip', () => {
    let q = Query.emptyQuery();
    let eq = Query.exists(q, 'prop');
    eq = Query.skip(eq, 100);
    expect(q).to.not.equal(eq);
    expect(q.skip).to.equal(0);
    expect(eq.skip).to.equal(100);
    expect(eq.where).to.deep.equal({prop: {$exists: true}});
  });

  test('limit', () => {
    let q = Query.emptyQuery();
    let eq = Query.exists(q, 'prop');
    eq = Query.limit(eq, 10);
    expect(q).to.not.equal(eq);
    expect(q.limit).to.equal(-1);
    expect(eq.limit).to.equal(10);
    expect(eq.where).to.deep.equal({prop: {$exists: true}});
  });

  test('include', () => {
    let q = Query.emptyQuery();
    let eq = Query.exists(q, 'prop');
    eq = Query.include(eq, 'field');
    expect(q).to.not.equal(eq);
    expect(q.include).to.deep.equal([]);
    expect(eq.include).to.deep.equal(['field']);
    expect(eq.where).to.deep.equal({prop: {$exists: true}});
  });
});
