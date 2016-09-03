/* @flow */

import copyWithoutFields from './copyWithoutFields';
import {decode} from './WireFormat';
import * as Ops from './Ops';
import Save from './Save';

import type App from './App';
import type { ParseObject } from './Types';

type SignUpOptions = {
  username: string,
  password: string,
  email?: string,
};

type LogInOptions = {
  username: string,
  password: string,
};

type AuthResponse = {
  sessionToken: string,
  user: ParseObject,
};

export function signUp(app: App, options: SignUpOptions): Promise<AuthResponse> {
  const user: ParseObject = {
    username: options.username,
    password: options.password,
  };
  if (options.email) {
    user.email = options.email;
  }
  return Save(app, '_User', user).then((u) => {
    if (!u.sessionToken) {
      return Promise.reject('Did not receive an authenticated user from the server.');
    }
    const sanitized = copyWithoutFields(u, ['password', 'sessionToken']);
    return Promise.resolve({
      user: sanitized,
      sessionToken: u.sessionToken,
    });
  });
}

export function logIn(app: App, options: LogInOptions): Promise<AuthResponse> {
  return app.client.get('login', options, {}).then((res) => {
    const result = res.response;
    if (!result) {
      return result;
    }
    const u: ParseObject = (decode(result): any);
    const sanitized = copyWithoutFields(u, ['sessionToken']);
    const serverData = {};
    for (let k in sanitized) {
      serverData[k] = sanitized[k];
    }
    Object.defineProperty(sanitized, '_serverData', {
      enumerable: false,
      writeable: false,
      configurable: false,
      value: serverData,
    });
    Object.defineProperty(sanitized, '_className', {
      enumerable: false,
      writeable: false,
      configurable: false,
      value: '_User',
    });
    const token = typeof u.sessionToken === 'string' ? u.sessionToken : '';
    return Promise.resolve({
      user: sanitized,
      sessionToken: token,
    });
  });
}

// "become" doesn't make a lot of sense in this sort of library
export function forSession(app: App, token: string): Promise<ParseObject> {
  return app.client.get('users/me', {}, {sessionToken: token}).then((res) => {
    const result = res.response;
    if (!result) {
      return result;
    }
    const u: ParseObject = (decode(result): any);
    return Promise.resolve(copyWithoutFields(u, ['sessionToken']));
  });
}

export function logOut(app: App, token: string): Promise<void> {
  return app.client.post('logout', {}, {sessionToken: token}).then(() => {
    return Promise.resolve();
  });
}
