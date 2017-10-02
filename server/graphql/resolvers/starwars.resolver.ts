import { makeExecutableSchema } from 'graphql-tools';
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
        //   return rp(url1_options);
        return fetch(URI).then(res => res.json());
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
