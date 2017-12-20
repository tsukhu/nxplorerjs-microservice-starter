import { Application } from 'express';
import { GraphQLOptions } from 'apollo-server-core';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../../graphql/schema';
import Register from 'graphql-playground-middleware-express';
import { MiddlewareOptions } from 'graphql-playground-html';

/**
 * Configure GraphQL endpoints
 * @param app Express Application
 */
export function configGraphQL(app: Application) {
  let graphQLServerOptions: GraphQLOptions = {
    schema: myGraphQLSchema
  };

  // Enable graphql tracing
  if (process.env.GRAPHQL_TRACING === 'true') {
    graphQLServerOptions.tracing = true;
  }

  // Add GraphQL Endpoint
  app.use('/graphql', graphqlExpress(graphQLServerOptions));

  // Add GraphQL Playground if enabled
  if (process.env.GRAPHQL_PLAYGROUND === 'true') {
    // GraphQL playground currently explects both the endpoints to be same
    let graphQLPlaygroundOptions: MiddlewareOptions = {
      endpoint: '/graphql',
      subscriptionsEndpoint: '/graphql'
    };
    app.get('/playground', Register(graphQLPlaygroundOptions));
  }

  // Add GraphQL Explorer Endpoint as well as subscription endpoint
  if (process.env.GRAPHQL_IQL === 'true') {
    app.get(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${process.env.PORT}/graphql`
      })
    );
  }
}
