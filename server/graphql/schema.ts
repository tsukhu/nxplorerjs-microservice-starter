import * as fetch from 'node-fetch';
import { merge } from 'lodash';
import StarwarsTypes from './models/starwars.model';
import ExampleTypes from './models/example.model';
import UserTypes from './models/user.model';
import MovieTypes from './models/movie.model';
import ChannelTypes from './models/channel.model';
import ExampleResolver from './resolvers/example.resolver';
import StarwarsResolver from './resolvers/starwars.resolver';
import UserResolver from './resolvers/user.resolver';
import MovieResolver from './resolvers/movie.resolver';
import ChannelResolver from './resolvers/channel.resolver';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql/type/schema';
import mocks from './mocks';

// GraphQL Subscription Definitions
const SubscriptionType = `
type SubscriptionType {
    exampleAdded: ExampleType!
    messageAdded(channelId: ID!): Message
}
`;

// GraphQL Mutation Definitions
const RootMutationType = `
type RootMutationType { 
    addExample(name: String!): ExampleType
    login( email: String!, password: String!): UserType
    addChannel(name: String!): Channel
    addMessage(message: MessageInput!): Message
}`;

// GraphQL Query Definitions
const RootQueryType = `
type RootQueryType { 
    quoteOfTheDay: String 
    random: Float 
    rollThreeDice: [Int] 
    peopleWithPlanet (id: Int!) : PeopleWithPlanetType 
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
    channels: [Channel]    # "[]" means this is a list of channels
    channel(id: ID!): Channel
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
  ChannelResolver
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
      ...ChannelTypes
    ],
    resolvers: resolvers
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
