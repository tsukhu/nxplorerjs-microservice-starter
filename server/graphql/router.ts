import * as express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from './schema';

export default express.Router()
    .use('/graphql', graphqlExpress({ schema: myGraphQLSchema }))
    .get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled