'use strict';

import clearApps from './clearApps';
import {expect} from 'chai';
import {App, Destroy, Ops, Query, Save} from '../../index';
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

suite('Destroy', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('destroying an object', (done) => {
    let obj;
    Save(app, 'TestObject', {}).then((o) => {
      obj = o;
      return Destroy(app, 'TestObject', o);
    }).then(() => {
      return Query.get(app, 'TestObject', obj);
    }).catch(({status, response}) => {
      expect(status).to.equal(404);
      expect(response.code).to.equal(101);
      done();
    }).catch(err => console.log(err));
  });

  test('destroying an object by id', (done) => {
    let id;
    Save(app, 'TestObject', {}).then((o) => {
      id = o.objectId;
      return Destroy(app, 'TestObject', o);
    }).then(() => {
      return Query.get(app, 'TestObject', id);
    }).catch(({status, response}) => {
      expect(status).to.equal(404);
      expect(response.code).to.equal(101);
      done();
    }).catch(err => console.log(err));
  });

  test('destroying an object that does not exist', (done) => {
    Destroy(app, 'TestObject', 'abc123').then(() => {
      throw new Error('Destroy should fail');
    }, ({status, response}) => {
      expect(status).to.equal(404);
      expect(response.code).to.equal(101);
      done();
    }).catch(err => console.log(err));
  });
});
