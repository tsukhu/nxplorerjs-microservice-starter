import * as http from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { setupSchema } from '../../graphql/setupSchema';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';
import { SubscriptionServer } from 'subscriptions-transport-ws';

export let subscriptionServer: SubscriptionServer;

/**
 * Configure GraphQL Subscription endpoint
 * @param app Express Application
 */
export const configGraphQLSubscription = (ws: http.Server) => {
  if (process.env.GRAPHQL_SUBSCRIPTIONS === 'true') {
    // Create subscription server
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema: setupSchema()
      },
      {
        server: ws,
        path: '/graphql'
      }
    );
    console.log('-------------------------------');
    console.log('Graphql Subscriptions : Enabled');
    console.log('-------------------------------');
  }
};
