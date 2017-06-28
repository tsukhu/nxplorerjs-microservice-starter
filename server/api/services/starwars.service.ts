import * as Promise from 'bluebird';
import { Observable } from 'rxjs/Observable';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import * as _ from 'lodash';

import { Planet, People } from '../models/starwars.model';
const rp: any = require('request-promise');


export class StarwarsService {


    public getPeopleById(id: number): Observable<People> {
        const loadedCharacter: AsyncSubject<People> = new AsyncSubject<People>();
        const character: Observable<People> = Observable.fromPromise(rp('http://swapi.co/api/people/' + id));
        const characterHomeworld: Observable<Planet> = Observable.fromPromise(rp('http://swapi.co/api/planets/' + id));

        Observable.forkJoin([character, characterHomeworld]).subscribe(results => {
            const result_0: People = JSON.parse(results[0]);
            const result_1: Planet = JSON.parse(results[1]);
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
