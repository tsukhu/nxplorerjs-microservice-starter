import * as fetch from 'node-fetch';
import { merge } from 'lodash';
import PeopleType from './models/starwars.model';
import PlanetType from './models/starwars.model';
import StarshipType from './models/starwars.model';
import PeopleWithPlanetType from './models/starwars.model';
import ExampleType  from './models/example.model';
import ExampleArrayType from './models/example.model';
import UserType from './models/user.model';
import ExampleResolver from './resolvers/example.resolver';
import StarwarsResolver from './resolvers/starwars.resolver';
import UserResolver from './resolvers/user.resolver';
import { makeExecutableSchema } from 'graphql-tools';


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

export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        RootQueryType,
        RootMutationType,
        SubscriptionType,
        // we have to destructure array imported from the post.js file
        // as typeDefs only accepts an array of strings or functions
        PeopleType,
        PlanetType,
        PeopleWithPlanetType,
        StarshipType,
        ExampleType,
        ExampleArrayType,
        UserType
    ],
    // we could also concatenate arrays
    // typeDefs: [SchemaDefinition, RootQuery].concat(Post)
    resolvers: resolvers,
});
