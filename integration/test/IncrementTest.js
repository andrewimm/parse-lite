'use strict';

import clearApps from './clearApps';
import {expect} from 'chai';
import {App, Ops, Query, Save} from '../../index';
import {Client} from 'ibeam';
import HttpController from 'ibeam/http-node';

const app = new App({
  applicationId: 'integration',
  https: false,
  host: 'localhost:1337/parse',
  httpController: HttpController,
});

const rawClient = new Client({
  https: false,
  host: 'localhost:1337',
  httpController: HttpController,
});

suite('Increment', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('incrementing a field', (done) => {
    Save(app, 'TestObject', {score: 1}).then((o) => {
      expect(o.score).to.equal(1);
      let inc = Ops.increment(o, 'score');
      return Save(app, 'TestObject', inc);
    }).then((o) => {
      expect(o.score).to.equal(2);
      done();
    }).catch((err) => console.log(err));
  });

  test('incrementing on a fresh object', (done) => {
    Save(app, 'TestObject', {}).then((o) => {
      let inc = Ops.increment(o, 'score');
      return Save(app, 'TestObject', inc);
    }).then((o) => {
      expect(o.score).to.equal(1);
      done();
    }).catch((err) => console.log(err));
  });

  test('incrementing by a value', (done) => {
    Save(app, 'TestObject', {score: 1}).then((o) => {
      let inc = Ops.increment(o, 'score', 10);
      return Save(app, 'TestObject', inc);
    }).then((o) => {
      expect(o.score).to.equal(11);
      let inc = Ops.increment(o, 'score', -5);
      return Save(app, 'TestObject', inc);
    }).then((o) => {
      expect(o.score).to.equal(6);
      done();
    }).catch((err) => console.log(err));
  });

  test('increments are atomic', (done) => {
    let obj = null;
    Save(app, 'TestObject', {score: 1}).then((o) => {
      obj = o;
      let inc5 = Ops.increment(o, 'score', 5);
      return Save(app, 'TestObject', inc5);
    }).then((o) => {
      expect(o.score).to.equal(6);
      let inc10 = Ops.increment(obj, 'score', 10);
      expect(inc10.score).to.equal(11);
      return Save(app, 'TestObject', inc10);
    }).then((o) => {
      expect(o.score).to.equal(16);
      done();
    }).catch((err) => console.log(err));
  });
});
