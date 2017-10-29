import * as fetch from 'node-fetch';
import ExampleService from '../../api/services/examples.service';
import { ExampleType, ExampleArrayType } from '../models/example.model';

import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';


let id = 0;


const examples: any = [
    { id: id++, name: 'example 0' },
    { id: id++, name: 'example 1' }
];

/**
 * Examples GraphQL resolver
 */
export class ExampleResolver {

    public list() {
        return { list: ExampleService.all() };
    }

    /**
     * Get People by ID
     * @param id people ID
     */
    public byId(id: number) {
        return ExampleService.byId(id);
    }

    public create(name: string) {
        return ExampleService.create(name);
    }

}


export default new ExampleResolver();
