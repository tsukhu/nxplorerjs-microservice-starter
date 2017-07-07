import * as Promise from 'bluebird';
import { Observable } from 'rxjs';
import { Example } from '../models/example.model';
import { LogManager } from '../../common/log-manager';


const LOG = LogManager.getInstance().getLogger();

const rp: any = require('request-promise');

const rxHttp: any = require('node-rx-http');

let id = 0;


const examples: Example[] = [
  { id: id++, name: 'example 0' },
  { id: id++, name: 'example 1' }
];

export class ExamplesService {
  public all(): Promise<Example[]> {
    return Promise.resolve(examples);
  }

  public byId(id: number): Promise<Example> {
    return this.all().then(r => r[id]);
  }

  public byPostsByID(id: number): Observable<any> {
    const url_options = {
            method: 'GET',
            uri: 'http://jsonplaceholder.typicode.com/posts/' + id,
            resolveWithFullResponse: true,
            json: true,
            time: true,
            timeout: process.env.TIME_OUT
        };
    LOG.info(url_options.uri);
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

export default new ExamplesService();
