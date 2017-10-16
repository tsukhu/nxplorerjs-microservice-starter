import * as fetch from 'node-fetch';
import StarwarsService from '../../api/services/starwars.service';
import { PeopleType, PlanetType } from '../models/starwars.model';

import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

/**
 * Starwars GraphQL resolver
 */
export class StarwarsResolver {

    /**
     * Get People by ID
     * @param id people ID
     */
    public getPeopleById(id: number) {

        const URI = 'http://swapi.co/api/people/' + id;
        return fetch(URI).then(res => res.json());
    }

    /**
     * Get People by ID RXJS
     * @param id people ID
     */
    public getPeopleByIdRxJs(id: number) {

        return new Promise(function (resolve, reject) {
            StarwarsService
                .getPeopleById(id)
                .subscribe(r => {
                    resolve(r);
                },
                error => {
                    reject(error);
                }
                );
        }
        );

    }

    /**
     * Get Planet by ID
     * @param id planet ID
     */
    public getPlanetById(id: number) {
        const URI = 'http://swapi.co/api/planets/' + id;
        return fetch(URI).then(res => res.json());
    }


}


export default new StarwarsResolver();
