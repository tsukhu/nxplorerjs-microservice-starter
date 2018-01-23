import { Application } from 'express';
import * as http from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { setupSchema } from '../../graphql/schema';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';
import { SubscriptionServer } from 'subscriptions-transport-ws';

export let subscriptionServer: SubscriptionServer;
/**
 * Configure GraphQL Subscription endpoint
 * @param app Express Application
 */
export const configGraphQLSubscription = (app: Application, callback: any) => {
  // Create Server so that it can be reused for the
  // configuring the SubscriptionServer
  const ws = http.createServer(app);
  ws.listen(process.env.PORT, err => {
    if (err) {
      throw new Error(err);
    }

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
    callback(process.env.PORT);
  });
};
