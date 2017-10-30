import * as fetch from 'node-fetch';
import { merge } from 'lodash';
import PeopleType from './models/starwars.model';
import PlanetType from './models/starwars.model';
import PeopleWithPlanetType from './models/starwars.model';
import ExampleType  from './models/example.model';
import ExampleArrayType from './models/example.model';
import ExampleResolver from './resolvers/example.resolver';
import StarwarsResolver from './resolvers/starwars.resolver';
import { makeExecutableSchema } from 'graphql-tools';


const SubscriptionType = `
type SubscriptionType {
    exampleAdded: ExampleType!
}
`;

const RootMutationType = `
type RootMutationType { 
    addExample(name: String!): ExampleType
}`;


const RootQueryType = `
type RootQueryType { 
    quoteOfTheDay: String 
    random: Float 
    rollThreeDice: [Int] 
    peopleWithPlanet (id: Int!) : PeopleWithPlanetType 
    people (id: Int!) : PeopleType 
    planet (id: Int!) : PlanetType 
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


const resolvers = merge(ExampleResolver, StarwarsResolver);

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
        ExampleType,
        ExampleArrayType
    ],
    // we could also concatenate arrays
    // typeDefs: [SchemaDefinition, RootQuery].concat(Post)
    resolvers: resolvers,
});
