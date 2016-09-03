declare module 'ibeam' {
  declare type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  declare type HttpHeaders = { [header: string]: string };

  declare type ClientOptions = {
    https?: boolean,
    host?: string,
    headers?: HttpHeaders,
  };

  declare type PreProcessor = (
    method: HttpMethod,
    path: string,
    payload: any,
    options: any
  ) => any;

  declare type HttpControllerResponse = {
    status: number,
    response: string,
  };

  declare type PostProcessor = (
    response: HttpControllerResponse
  ) => any;

  declare class Client {
    constructor(config: {[opt: string]: any}): Client;
    getConfig(): {[opt: string]: any};
    get(path: string, payload: any, options?: any): Promise<any>;
    post(path: string, payload: any, options?: any): Promise<any>;
    put(path: string, payload: any, options?: any): Promise<any>;
    patch(path: string, payload: any, options?: any): Promise<any>;
    delete(path: string, payload: any, options?: any): Promise<any>;
    raw(method: HttpMethod, path: string, payload: any, options?: any): Promise<any>;
  }

  declare function addRequestPreProcessor(
    client: Client,
    processor: PreProcessor
  ): Client;

  declare function addResponsePostProcessor(
    client: Client,
    processor: PostProcessor
  ): Client;
}
