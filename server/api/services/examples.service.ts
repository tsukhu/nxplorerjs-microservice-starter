import * as Promise from 'bluebird';
import { Observable } from 'rxjs';
import { Example } from '../models/example.model';

import SERVICE_IDENTIFIER from '../../common/constants/identifiers';
import ILogger from '../../common/interfaces/ilogger';
import IExample from '../interfaces/iexample';
import { provideSingleton, iocContainer, inject , provide} from '../../common/config/ioc';



const rp: any = require('request-promise');

const rxHttp: any = require('node-rx-http');

let id = 0;

const examples: Example[] = [
  { id: id++, name: 'example 0' },
  { id: id++, name: 'example 1' }
];

/**
 * Examples Service Implementation
 */
@provide(ExamplesService)
export class ExamplesService implements IExample {

  public logService: ILogger;

  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) logger: ILogger
  ) {
    this.logService = logger;
  }

  public all(): Promise<Example[]> {
    return Promise.resolve(examples);
  }

  public byId(id: number): Promise<Example> {
    return this.all().then(r => r[id]);
  }

  public byPostsByID(id: number): Observable<any> {

    // Request perfroamcne interceptor
    const _include_headers = function (body, response, resolveWithFullResponse) {
      return { 'timings': response.timings, 'data': body };
    };

    const url_options = {
      method: 'GET',
      uri: 'http://jsonplaceholder.typicode.com/posts/' + id,
      resolveWithFullResponse: true,
      json: true,
      time: true,
      timeout: process.env.TIME_OUT,
      transform: _include_headers
    };
    const api = { uri: url_options.uri, method: url_options.method };
    this.logService.info(api);
    return Observable.fromPromise(rp(url_options));
  }

  public create(name: string): Promise<Example> {
    const example: Example = {
      id: id++,
      name
    };
    examples.push(example);

    return Promise.resolve(example);
  }

  public sampleAPI(): Observable<Example[]> {
    return Observable.of(examples);
  }
}

export default ExamplesService;
