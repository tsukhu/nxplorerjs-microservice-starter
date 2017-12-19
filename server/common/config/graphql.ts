import { Application } from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../../graphql/schema';
import Register from 'graphql-playground-middleware-express';
import {
  MiddlewareOptions,
  RenderPageOptions,
  renderPlaygroundPage,
} from 'graphql-playground-html';

/**
 * Configure GraphQL endpoints
 * @param app Express Application
 */
export function configGraphQL(app: Application) {

    // Add GraphQL Endpoint
    app.use('/graphql', graphqlExpress({ schema: myGraphQLSchema }));
    app.get('/playground', Register({ 
      endpoint: '/graphql',
      subscriptionsEndpoint: '/graphql'
    }))

    // Add GraphQL Explorer Endpoint as well as subscription endpoint
    app.get(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${
          process.env.PORT
        }/graphql`
      })
    );
}
