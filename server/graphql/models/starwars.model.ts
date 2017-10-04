import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

export const PeopleWithPlanetType = new GraphQLObjectType({
    name: 'PeopleWithPlanetType',
    description: 'Starwars people with planets API',
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

export const PeopleType = new GraphQLObjectType({
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
            type: GraphQLString
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

export const PlanetType = new GraphQLObjectType({
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


