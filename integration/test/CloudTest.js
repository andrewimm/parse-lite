'use strict';

import clearApps from './clearApps';
import {expect} from 'chai';
import {App, Cloud} from '../../index';
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

suite('Cloud', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('basic cloud function', (done) => {
    Cloud(app, 'hello').then((r) => {
      expect(r).to.equal('Hi');
      done();
    }).catch(e => console.log(e));
  });

  test('receiving an object', (done) => {
    Cloud(app, 'number').then((o) => {
      expect(o.objectId).to.exist;
      expect(o.className).to.equal('Num');
      expect(o.value).to.equal(-1);
      done();
    }).catch(e => console.log(e));
  });

  test('passing values', (done) => {
    Cloud(app, 'number', {value: 12}).then((o) => {
      expect(o.objectId).to.exist;
      expect(o.className).to.equal('Num');
      expect(o.value).to.equal(12);
      done();
    }).catch(e => console.log(e));
  });

  test('receiving an error', (done) => {
    Cloud(app, 'problem').catch((err) => {
      expect(err.code).to.equal(141);
      expect(err.error).to.equal('Oops');
      done();
    }).catch(e => console.log(e));
  });
});
