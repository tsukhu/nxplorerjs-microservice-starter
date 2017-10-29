import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
    GraphQLList
} from 'graphql';

export interface Example {
    id: number;
    name: string;
}

export const ExampleType = new GraphQLObjectType({
    name: 'Example',
    description: 'Example GraphQL Type',
    fields: () => ({
        id: {
            type: GraphQLInt
        },
        name: {
            type: GraphQLString
        }
    })
}
);

export const ExampleArrayType = new GraphQLObjectType({
    name: 'examples',
    description: 'ExampleArray GraphQL Type',
    fields: () => ({
        list: { type: new GraphQLList(ExampleType) }
    })
}
);
