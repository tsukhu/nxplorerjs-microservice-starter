import * as fetch from 'node-fetch';
import { PeopleType, PlanetType, PeopleWithPlanetType } from './models/starwars.model';
import { ExampleType, ExampleArrayType } from './models/example.model';
import ExampleResolver from './resolvers/example.resolver';
import StarwarsResolver from './resolvers/starwars.resolver';

import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root of all... mutations',
    fields: () => ({
        addExample: {
            type: ExampleType,
            args: {
                name: { type: GraphQLString }
              },
              resolve: (root, args) => {
                return ExampleResolver.create(args.name);
              }
        }
    }

    )
});
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
        },
        example: {
            type: ExampleType,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (root, args) => {
                return ExampleResolver.byId(args.id);
            }
        },
        examples: {
            type: ExampleArrayType,
            resolve: (root, args) => {
                return ExampleResolver.list();
            }
        }
    }),
});


export default new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});
