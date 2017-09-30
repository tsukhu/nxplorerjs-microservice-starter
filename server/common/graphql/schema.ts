import { makeExecutableSchema } from 'graphql-tools';

const RootQuery = `
 type RootQuery {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
  }
`;

export default makeExecutableSchema({
    typeDefs: [SchemaDefinition, RootQuery],
    resolvers: {
        RootQuery: {
            quoteOfTheDay: () => {
                return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
            },
            random: () => {
                return Math.random();
            },
            rollThreeDice: () => {
                return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
            },
        }
    }
});