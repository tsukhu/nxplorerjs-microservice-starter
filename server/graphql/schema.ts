import * as fetch from 'node-fetch';
import { merge } from 'lodash';
import PeopleType from './models/starwars.model';
import PlanetType from './models/starwars.model';
import StarshipType from './models/starwars.model';
import PeopleWithPlanetType from './models/starwars.model';
import ExampleType from './models/example.model';
import ExampleArrayType from './models/example.model';
import UserType from './models/user.model';
import ExampleResolver from './resolvers/example.resolver';
import StarwarsResolver from './resolvers/starwars.resolver';
import UserResolver from './resolvers/user.resolver';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql/type/schema';

const SubscriptionType = `
type SubscriptionType {
    exampleAdded: ExampleType!
}
`;

const RootMutationType = `
type RootMutationType { 
    addExample(name: String!): ExampleType
    login( email: String!, password: String!): UserType
}`;

const RootQueryType = `
type RootQueryType { 
    quoteOfTheDay: String 
    random: Float 
    rollThreeDice: [Int] 
    peopleWithPlanet (id: Int!) : PeopleWithPlanetType 
    people (id: Int!) : PeopleType
    ex2: PeopleType
    peopleList(keys: [Int]): [PeopleType]
    planet (id: Int!) : PlanetType
    starship (id: Int!) : StarshipType 
    example (id: Int!) : ExampleType 
    examples: [ExampleType]
}`;

const SchemaDefinition = `
schema {
    query: RootQueryType 
    mutation: RootMutationType
    subscription: SubscriptionType
}
  `;

const resolvers = merge(ExampleResolver, StarwarsResolver, UserResolver);

export const setupSchema = (): GraphQLSchema => {
  const schema = makeExecutableSchema({
    typeDefs: [
      SchemaDefinition,
      RootQueryType,
      RootMutationType,
      SubscriptionType,
      PeopleType,
      PlanetType,
      PeopleWithPlanetType,
      StarshipType,
      ExampleType,
      ExampleArrayType,
      UserType
    ],
    resolvers: resolvers
  });

  if ( process.env.GRAPHQL_MOCK != undefined && process.env.GRAPHQL_MOCK === 'true') {
    // Add mocks, modifies schema in place
    // Preserve resolvers that are implemented
    addMockFunctionsToSchema({
      schema,
      mocks: {},
      preserveResolvers: true
    });
  }
  return schema;
};
