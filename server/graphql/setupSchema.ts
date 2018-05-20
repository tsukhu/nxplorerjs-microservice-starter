import { importSchema } from 'graphql-import';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql/type/schema';
import { merge } from 'lodash';
import AuthDirective from './directives/authDirective';
import FormattableDateDirective from './directives/formattableDate';
import mocks from './mocks';
import { BlogResolver, ExampleResolver, MovieResolver, StarwarsResolver, UserResolver } from './resolvers';

const typeDefs = importSchema('server/graphql/schema/main.graphql');


// Merge all the resolvers
const resolvers = merge(
  ExampleResolver,
  StarwarsResolver,
  UserResolver,
  MovieResolver,
  BlogResolver
);

// Create GraphQL Schema with all the pieces in place 
export const setupSchema = (): GraphQLSchema => {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: resolvers,
    schemaDirectives: {
      date: FormattableDateDirective,
      auth: AuthDirective
    }
  });

  if (
    process.env.GRAPHQL_MOCK !== undefined &&
    process.env.GRAPHQL_MOCK === 'true'
  ) {
    // Add mocks, modifies schema in place
    // Preserve resolvers that are implemented
    addMockFunctionsToSchema({
      schema,
      mocks: mocks,
      preserveResolvers: true
    });
  }
  return schema;
};
