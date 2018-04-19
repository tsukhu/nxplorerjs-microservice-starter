import { merge } from 'lodash';
import StarwarsTypes from './models/starwars.model';
import ExampleTypes from './models/example.model';
import UserTypes from './models/user.model';
import MovieTypes from './models/movie.model';
import BlogTypes from './models/blog.model';
import ExampleResolver from './resolvers/example.resolver';
import StarwarsResolver from './resolvers/starwars.resolver';
import UserResolver from './resolvers/user.resolver';
import MovieResolver from './resolvers/movie.resolver';
import BlogResolver from './resolvers/blog.resolver';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import FormattableDateDirective from './directives/formattableDate';
import { GraphQLSchema } from 'graphql/type/schema';

import mocks from './mocks';

// GraphQL Subscription Definitions
const SubscriptionType = `
type SubscriptionType {
    exampleAdded: ExampleType!
    commentAdded(blogId: ID!): Comment
}
`;

// GraphQL Mutation Definitions
const RootMutationType = `
type RootMutationType { 
    addExample(name: String!): ExampleType
    login( email: String!, password: String!): UserType
    addBlog(name: String!): Blog
    addComment(comment: CommentInput!): Comment
}`;

// GraphQL Query Definitions
const RootQueryType = `
directive @date(
  defaultFormat: String = "mmmm d, yyyy"
) on FIELD_DEFINITION

scalar Date

type RootQueryType { 
    quoteOfTheDay: String 
    random: Float 
    rollThreeDice: [Int] 
    peopleWithPlanet (id: Int!) : PeopleWithPlanetType 
    """
      Schema directive based example
    """
    today: Date @date
    people (id: Int!) : PeopleType
    peopleList(keys: [Int]): [PeopleType]
    peopleMock:  PeopleType
    planet (id: Int!) : PlanetType
    starship (id: Int!) : StarshipType 
    example (id: Int!) : ExampleType
    exampleMock: ExampleType
    examplesMock: [ExampleType] 
    examples: [ExampleType]
    movie: MovieType
    blogs: [Blog]    # "[]" means this is a list of blogs
    blog(id: ID!): Blog
}`;

// GraphQL Schema Definitions
const SchemaDefinition = `
schema {
    query: RootQueryType 
    mutation: RootMutationType
    subscription: SubscriptionType
}
  `;

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
    typeDefs: [
      SchemaDefinition,
      RootQueryType,
      RootMutationType,
      SubscriptionType,
      ...StarwarsTypes,
      ...ExampleTypes,
      ...UserTypes,
      ...MovieTypes,
      ...BlogTypes
    ],
    resolvers: resolvers,
    schemaDirectives: {
      date: FormattableDateDirective
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
