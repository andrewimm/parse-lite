/* @flow */

import {
  Client,
  addRequestPreProcessor,
  addResponsePostProcessor
} from 'ibeam';

import type {
  AuthOptions,
} from './Types';

export default class App {
  _ApplicationId: string;
  _JavaScriptKey: ?string;
  _MasterKey: ?string;
  _bareClient: Client;
  client: Client;

  constructor(options: Object = {}) {
    const clientOpts: Object = {
      host: options.host,
      format: 'json',
    };
    if (options.hasOwnProperty('https')) {
      clientOpts.https = options.https;
    }
    if (options.hasOwnProperty('httpController')) {
      clientOpts.httpController = options.httpController;
    }
    this._ApplicationId = options.applicationId;
    this._JavaScriptKey = options.javaScriptKey;
    this._MasterKey = options.masterKey;
    this._bareClient = new Client(clientOpts);
    this.client = addResponsePostProcessor(
      addRequestPreProcessor(this._bareClient, this.requestPreProcessor.bind(this)),
      this.responsePostProcessor
    );
  }

  requestPreProcessor(method: string, path: string, payload: any, options: AuthOptions) {
    const json: Object = {
      _ApplicationId: this._ApplicationId,
    };
    if (this._JavaScriptKey) {
      json._JavaScriptKey = this._JavaScriptKey;
    }
    if (payload && typeof payload === 'object') {
      for (let key in payload) {
        json[key] = payload[key];
      }
    }
    if (options.useMasterKey) {
      if (this._MasterKey) {
        json._MasterKey = this._MasterKey;
      } else {
        throw new Error('Cannot use the master key. It has not been provided.');
      }
    }
    if (options.sessionToken) {
      json._SessionToken = options.sessionToken;
    }
    json._method = method;
    const clientOpts = {
      headers: {
        'Content-Type': 'text/plain',
      },
    };
    for (let key in options) {
      if (key !== 'sessionToken' && key !== 'useMasterKey') {
        clientOpts[key] = options[key];
      }
    }

    return {
      method: 'POST',
      payload: json,
      options: clientOpts,
    };
  }

  responsePostProcessor(
    response: {status: number, response: string}
  ): Promise<{status: number, response: Object}> {
    let body = null;
    try {
      body = JSON.parse(response.response);
    } catch (e) {
      return Promise.reject({
        status: response.status,
        response: `Could not parse JSON response: "${response.response}"`,
      });
    }
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve({
        status: response.status,
        response: body,
      });
    }
    return Promise.reject({
      status: response.status,
      response: body,
    });
  }
}
