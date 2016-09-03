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

suite('Save', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('saving returns an object id', (done) => {
    Save(app, 'TestObject', {}).then((o) => {
      expect(o.objectId).to.exist;
      done();
    }).catch(err => console.log(err));
  });

  test('saving attaches hidden fields', (done) => {
    Save(app, 'TestObject', {count: 5}).then((o) => {
      expect(o.count).to.equal(5);
      expect(o._serverData.count).to.equal(5);
      expect(o._className).to.equal('TestObject');
      expect(o._opSet).to.deep.equal({});
      done();
    }).catch(err => console.log(err));
  });

  test('saving updates an existing object, immutably', (done) => {
    let obj = null;
    Save(app, 'TestObject', {count: 10}).then((o) => {
      obj = o;
      return Save(app, 'TestObject', {objectId: o.objectId, foo: 'bar'});
    }).then((o) => {
      expect(o.objectId).to.equal(obj.objectId);
      expect(o.foo).to.equal('bar');
      expect(o.count).to.not.exist;
      expect(o).to.not.equal(obj);
      done();
    }).catch(err => console.log(err));
  });
});
