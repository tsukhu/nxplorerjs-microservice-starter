import * as Promise from 'bluebird';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import * as _ from 'lodash';
import { Planet, People } from '../models/starwars.model';
import { LogManager } from '../../common/log-manager';


const LOG = LogManager.getInstance().getLogger();

const rp: any = require('request-promise');


export class StarwarsService {


    public getPeopleById(id: number): Observable<People> {
        const loadedCharacter: AsyncSubject<People> = new AsyncSubject<People>();
        const url1_options = {
            method: 'GET',
            uri: 'http://swapi.co/api/people/' + id,
            resolveWithFullResponse: true,
            json: true,
            time: true,
            timeout: process.env.TIME_OUT
        };
        const url2_options = {
            method: 'GET',
            uri: 'http://swapi.co/api/planets/' + id,
            resolveWithFullResponse: true,
            json: true,
            time: true,
            timeout: process.env.TIME_OUT
        };
        const character: Observable<People> = Observable.fromPromise(rp(url1_options));
        const characterHomeworld: Observable<Planet> = Observable.fromPromise(rp(url2_options));

        Observable.forkJoin([character, characterHomeworld]).subscribe(
            results => {
                //     const result_0: People = JSON.parse(results[0]);
                //     const result_1: Planet = JSON.parse(results[1]);
                LOG.info(url1_options.uri, results[0].timings);
                LOG.info(url2_options.uri, results[1].timings);
                const result_0: People = results[0].body;
                const result_1: Planet = results[1].body;
                result_0.homeworld = result_1;
                loadedCharacter.next(result_0);
                loadedCharacter.complete();
            },
            err => {
                loadedCharacter.next(undefined);
                loadedCharacter.complete();
            });



        return loadedCharacter;
    }
}


export default new StarwarsService();
