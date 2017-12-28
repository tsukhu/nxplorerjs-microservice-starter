import * as Promise from 'bluebird';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import * as _ from 'lodash';
import { Planet, People } from '../models/starwars.model';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';

import ILogger from '../../common/interfaces/ilogger';
import IStarwars from '../interfaces/istarwars';

import { provideSingleton, iocContainer, inject, provide} from '../../common/config/ioc';

const rp: any = require('request-promise');

/**
 * Starwars Service Implementation
 */
@provide(StarwarsService)
export class StarwarsService implements IStarwars {

    public loggerService: ILogger;
    public constructor(
        @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
    ) {
        this.loggerService = loggerService;
    }

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
        const character: Observable<any> = Observable.fromPromise(rp(url1_options));
        const characterHomeworld: Observable<any> = Observable.fromPromise(rp(url2_options));

        Observable.forkJoin([character, characterHomeworld]).subscribe(
            results => {
                //     const result_0: People = JSON.parse(results[0]);
                //     const result_1: Planet = JSON.parse(results[1]);
                this.loggerService.info(url1_options.uri, results[0].timings);
                this.loggerService.info(url2_options.uri, results[1].timings);
                const result_0: People = results[0].body;
                const result_1: Planet = results[1].body;
                result_0.homeworld = result_1;
                loadedCharacter.next(result_0);
                loadedCharacter.complete();
            },
            error => {
                this.loggerService.info(url1_options.uri, error);
                this.loggerService.info(url2_options.uri, error);
                loadedCharacter.next(undefined);
                loadedCharacter.complete();
            });

        return loadedCharacter;
    }
}

export default StarwarsService;
