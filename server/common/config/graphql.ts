import { Application } from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../../graphql/schema';

/**
 * Configure GraphQL endpoints
 * @param app Express Application
 */
export function configGraphQL(app) {
    
    // Add GraphQL Endpoint
    app.use('/graphql', graphqlExpress({ schema: myGraphQLSchema }));
    // Add GraphQL Explorer Endpoint as well as subscription endpoint
    app.get(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${
          process.env.PORT
        }/subscriptions`
      })
    );
}
