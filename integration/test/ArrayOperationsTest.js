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

suite('Array Operations', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('adding values', (done) => {
    Save(app, 'TestObject', { strings: ['foo'] }).then((o) => {
      expect(o.strings).to.deep.equal(['foo']);

      let add = Ops.add(o, 'strings', ['foo', 'bar', 'baz']);
      return Save(app, 'TestObject', add);
    }).then((o) => {
      expect(o.strings).to.deep.equal(['foo', 'foo', 'bar', 'baz']);
      done();
    }).catch(e => console.log(e));
  });

  test('adding values on a fresh object', (done) => {
    Save(app, 'TestObject', {}).then((o) => {
      let add = Ops.add(o, 'strings', ['foo', 'bar', 'baz']);
      return Save(app, 'TestObject', add);
    }).then((o) => {
      expect(o.strings).to.deep.equal(['foo', 'bar', 'baz']);
      done();
    }).catch(e => console.log(e));
  });

  test('combining set with add', (done) => {
    Save(app, 'TestObject', {}).then((o) => {
      let set = Ops.set(o, {strings: ['bar']});
      let add = Ops.add(set, 'strings', ['baz']);
      expect(add.strings).to.deep.equal(['bar', 'baz']);
      expect(add._opSet.strings.__op).to.equal('Add');
      return Save(app, 'TestObject', add);
    }).then((o) => {
      expect(o.strings).to.deep.equal(['baz']);
      done();
    }).catch(e => console.log(e));
  });

  test('adding unique values', (done) => {
    Save(app, 'TestObject', { strings: ['foo'] }).then((o) => {
      expect(o.strings).to.deep.equal(['foo']);

      let add = Ops.addUnique(o, 'strings', ['foo', 'bar', 'baz']);
      return Save(app, 'TestObject', add);
    }).then((o) => {
      expect(o.strings).to.deep.equal(['foo', 'bar', 'baz']);
      done();
    }).catch(e => console.log(e));
  });

  test('removing values', (done) => {
    Save(app, 'TestObject', { strings: ['foo', 'bar', 'baz'] }).then((o) => {
      expect(o.strings).to.deep.equal(['foo', 'bar', 'baz']);

      let add = Ops.remove(o, 'strings', ['bar', 'bat']);
      return Save(app, 'TestObject', add);
    }).then((o) => {
      expect(o.strings).to.deep.equal(['foo', 'baz']);
      done();
    }).catch(e => console.log(e));
  });
});
