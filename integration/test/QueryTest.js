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

suite('Query', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('getting a single object', (done) => {
    let id;
    Save(app, 'QueryObject', {}).then((o) => {
      id = o.objectId;
      return Query.get(app, 'QueryObject', id);
    }).then((o) => {
      expect(o.objectId).to.equal(id);
      expect(o.createdAt).to.exist;
      done();
    }).catch(err => console.log(err));
  });

  test('getting objects by equality', (done) => {
    Promise.all([
      Save(app, 'QueryObject', {draft: true, score: 10}),
      Save(app, 'QueryObject', {draft: false, score: 20}),
      Save(app, 'QueryObject', {draft: true, score: 30}),
    ]).then(() => {
      const query = Query.equalTo({}, 'draft', true);
      return Query.find(app, 'QueryObject', query);
    }).then((objs) => {
      expect(objs.length).to.equal(2);
      const query = Query.equalTo({}, 'draft', false);
      return Query.find(app, 'QueryObject', query);
    }).then((objs) => {
      expect(objs.length).to.equal(1);
      expect(objs[0].score).to.equal(20);
      done();
    }).catch(e => console.log(e));
  });

  test('getting objects by keys in an array', (done) => {
    Promise.all([
      Save(app, 'QueryObject', {tags: ['a', 'b']}),
      Save(app, 'QueryObject', {tags: ['b', 'c']}),
      Save(app, 'QueryObject', {tags: ['a', 'c']}),
    ]).then(() => {
      const query = Query.equalTo({}, 'tags', 'b');
      return Query.find(app, 'QueryObject', query);
    }).then((objs) => {
      expect(objs.length).to.equal(2);
      if (objs[0].tags[0] === 'a') {
        expect(objs[0].tags).to.deep.equal(['a', 'b']);
        expect(objs[1].tags).to.deep.equal(['b', 'c']);
      } else {
        expect(objs[0].tags).to.deep.equal(['b', 'c']);
        expect(objs[1].tags).to.deep.equal(['a', 'b']);
      }
      done();
    }).catch(e => console.log(e));
  });
});
