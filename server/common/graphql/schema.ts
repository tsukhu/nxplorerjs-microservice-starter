import { makeExecutableSchema } from 'graphql-tools';
import * as fetch from 'node-fetch';
import StarwarsService from '../../api/services/starwars.service';
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
        people: {
            type: PeopleType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (root, args) => {

                const URI = 'http://swapi.co/api/people/' + args.id;
                //   return rp(url1_options);
                return fetch(URI).then(res => res.json());
            }
        },
        planet: {
            type: PlanetType,
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (root, args) => {

                const URI = 'http://swapi.co/api/planets/' + args.id;
                return fetch(URI).then(res => res.json());
            }
        }
    }),
});

const PeopleType = new GraphQLObjectType({
    name: 'Person',
    description: 'Starwars people API',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        height: {
            type: GraphQLString
        },
        mass: {
            type: GraphQLString
        },
        hair_color: {
            type: GraphQLString
        },
        skin_color: {
            type: GraphQLString
        },
        eye_color: {
            type: GraphQLString
        },
        birth_year: {
            type: GraphQLString
        },
        gender: {
            type: GraphQLString
        },
        homeworld: {
            type: PlanetType
        },
        films: {
            type: new GraphQLList(GraphQLString)
        },
        species: {
            type: new GraphQLList(GraphQLString)
        },
        vehicles: {
            type: new GraphQLList(GraphQLString)
        },
        starships: {
            type: new GraphQLList(GraphQLString)
        },
        created: {
            type: GraphQLString
        },
        edited: {
            type: GraphQLString
        },
        url: {
            type: GraphQLString
        }
    }),
});

const PlanetType = new GraphQLObjectType({
    name: 'Planet',
    description: 'Starwars planets',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        rotation_period: {
            type: GraphQLString
        },
        orbital_period: {
            type: GraphQLString
        },
        diameter: {
            type: GraphQLString
        },
        climate: {
            type: GraphQLString
        },
        gravity: {
            type: GraphQLString
        },
        terrain: {
            type: GraphQLString
        },
        surface_water: {
            type: GraphQLString
        },
        population: {
            type: GraphQLString
        },
        residents: {
            type: new GraphQLList(GraphQLString)
        },
        films: {
            type: new GraphQLList(GraphQLString)
        },
        created: {
            type: GraphQLString
        },
        edited: {
            type: GraphQLString
        },
        url: {
            type: GraphQLString
        }
    }),
});

export default new GraphQLSchema({
    query: RootQueryType
});
