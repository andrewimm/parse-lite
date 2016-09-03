'use strict';

import clearApps from './clearApps';
import {expect} from 'chai';
import {App, Ops, Query, Save, User} from '../../index';
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

suite('User', () => {
  beforeEach((done) => {
    clearApps(rawClient).then(() => {
      done();
    }, (err) => {
      console.log('Clear App Error:', err);
    });
  });

  test('signing up', (done) => {
    User.signUp(app, {
      username: 'andrew',
      password: 's3cret',
    }).then(({sessionToken, user}) => {
      expect(sessionToken).to.exist;
      expect(user.objectId).to.exist;
      expect(user.username).to.equal('andrew');
      expect(user.password).to.not.exist;
      expect(user.sessionToken).to.not.exist;
      done();
    }).catch(e => console.log(e));
  });

  test('signing up with email', (done) => {
    User.signUp(app, {
      username: 'andrew',
      email: 'a@example.com',
      password: 's3cret',
    }).then(({sessionToken, user}) => {
      expect(sessionToken).to.exist;
      expect(user.objectId).to.exist;
      expect(user.username).to.equal('andrew');
      expect(user.email).to.equal('a@example.com');
      done();
    }).catch(e => console.log(e));
  });

  test('modifying a user', (done) => {
    let token, u;
    User.signUp(app, {
      username: 'andrew',
      password: 's3cret',
    }).then(({sessionToken, user}) => {
      token = sessionToken;
      u = user;
      return Save(app, '_User', Ops.set(user, {age: 27}));
    }).then(() => {
      // Expect an error
      throw new Error('Save should fail');
    }, () => {
      return Save(app, '_User', Ops.set(u, {age: 28}), {sessionToken: token});
    }).then((user) => {
      expect(user.username).to.equal('andrew');
      expect(user.age).to.equal(28);
      done();
    }).catch(e => console.log(e));
  });

  test('logging in', (done) => {
    User.signUp(app, {username: 'andrew', password: 's3cret'}).then(() => {
      return User.logIn(app, {username: 'andrew', password: 'wrong'});
    }).then(() => {
      throw new Error('First login should fail');
    }, () => {
      return User.logIn(app, {username: 'andrew', password: 's3cret'});
    }).then(({sessionToken, user}) => {
      expect(user.username).to.equal('andrew');
      done();
    }).catch(e => console.log(e));
  });

  test('user has server fields', (done) => {
    let m;
    User.signUp(app, {username: 'andrew', password: 's3cret'}).then(({user}) => {
      expect(user._serverData).to.exist;
      expect(user._serverData.username).to.equal('andrew');
      expect(user._serverData.createdAt).to.exist;
      const modified = Ops.set(user, {score: 12});
      expect(user.score).to.equal(undefined);
      expect(modified.score).to.equal(12);
      expect(modified._serverData.score).to.equal(undefined);
      expect(modified._opSet).to.deep.equal({score: 12});
      return User.logIn(app, {username: 'andrew', password: 's3cret'});
    }).then(({user, sessionToken}) => {
      expect(user._serverData).to.exist;
      expect(user._serverData.username).to.equal('andrew');
      expect(user._serverData.createdAt).to.exist;
      expect(user._serverData.updatedAt).to.exist;
      const modified = Ops.set(user, {score: 12});
      expect(user.score).to.equal(undefined);
      expect(modified.score).to.equal(12);
      expect(modified._serverData.score).to.equal(undefined);
      expect(modified._opSet).to.deep.equal({score: 12});
      m = modified;
      return Save(app, '_User', modified, {sessionToken});
    }).then((user) => {
      expect(user.score).to.equal(12);
      expect(user._serverData.score).to.equal(12);
      expect(user._opSet).to.deep.equal({});
      expect(m.score).to.equal(12);
      expect(m._serverData.score).to.equal(undefined);
      expect(m._opSet.score).to.equal(12);
      done();
    }).catch(e => console.log(e));
  });

  test('getting a user for a session token', (done) => {
    User.signUp(app, {
      username: 'andrew',
      password: 's3cret'
    }).then(({sessionToken}) => {
      return User.forSession(app, sessionToken);
    }).then((user) => {
      expect(user.username).to.equal('andrew');
      done();
    }).catch(e => console.log(e));
  });

  test('logging out', (done) => {
    let token;
    User.signUp(app, {
      username: 'andrew',
      password: 's3cret',
    }).then(({sessionToken}) => {
      token = sessionToken;
      return User.logOut(app, sessionToken);
    }).then(() => {
      return User.forSession(app, token);
    }).then(() => {
      throw new Error('Finding user should fail');
    }, (e) => {
      done();
    }).catch(e => console.log(e));
  });
});
