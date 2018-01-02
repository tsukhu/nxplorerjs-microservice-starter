import { Application } from 'express';
import { GraphQLOptions } from 'apollo-server-core';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../../graphql/schema';
import Register from 'graphql-playground-middleware-express';
import { MiddlewareOptions } from 'graphql-playground-html';
import { configJWT } from './jwt';
import * as bodyParser from 'body-parser';
const expressJwt = require('express-jwt');
import * as fs from 'fs';

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

  // If JWT Auth is enabled added JWT header verification for all graphql
  // calls
  if (process.env.JWT_AUTH === 'true') {
    const RSA_PUBLIC_KEY = fs.readFileSync(process.env.RSA_PUBLIC_KEY_FILE);
    // If a valid Bearer token is present the req.user object is set
    // set those details in the context.user
    // The context can then be used by the resolvers to validate user credentials
    app.use(
      '/graphql',
      bodyParser.json(),
      expressJwt({ secret: RSA_PUBLIC_KEY, credentialsRequired: false }),
      graphqlExpress((req: any) => ({
        schema: myGraphQLSchema,
        context: {
          user: req.user ? req.user : Promise.resolve(null)
        }
      }))
    );
  } else {
    // Add GraphQL Endpoint
    app.use(
      '/graphql',
      graphqlExpress({
        schema: myGraphQLSchema
      })
    );
  }

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
