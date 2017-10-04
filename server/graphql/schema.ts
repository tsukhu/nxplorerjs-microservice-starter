import * as fetch from 'node-fetch';
import { PeopleType, PlanetType , PeopleWithPlanetType } from './models/starwars.model';
import StarwarsResolver from './resolvers/starwars.resolver';

import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of all... queries',
    fields: () => ({
        quoteOfTheDay: {
            type: GraphQLString,
            resolve: () => {
                return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
            }
        },
        random: {
            type: GraphQLFloat,
            resolve: () => {
                return Math.random();
            }
        },
        rollThreeDice: {
            type: new GraphQLList(GraphQLInt),
            resolve: () => {
                return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
            }
        },
        peopleWithPlanet: {
            type: PeopleWithPlanetType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (root, args) => {
                return StarwarsResolver.getPeopleByIdRxJs(args.id);
            }
        },
        people: {
            type: PeopleType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (root, args) => {
                return StarwarsResolver.getPeopleById(args.id);
            }
        },
        planet: {
            type: PlanetType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (root, args) => {
                return StarwarsResolver.getPlanetById(args.id);
            }
        }
    }),
});


export default new GraphQLSchema({
    query: RootQueryType
});
