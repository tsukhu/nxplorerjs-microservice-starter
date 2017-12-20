import { Application } from 'express';
import * as http from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../../graphql/schema';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';
import { SubscriptionServer } from 'subscriptions-transport-ws';

export let subscriptionServer: SubscriptionServer;
/**
 * Configure GraphQL Subscription endpoint
 * @param app Express Application
 */
export function configGraphQLSubscription(app: Application, callback: any) {
  // Create Server so that it can be reused for the
  // configuring the SubscriptionServer
  const ws = http.createServer(app);
  ws.listen(process.env.PORT, err => {
    if (err) {
      throw new Error(err);
    }
    if (process.env.GRAPHQL_SUBSCRIPTIONS === 'true') {
      new SubscriptionServer(
        {
          execute,
          subscribe,
          schema: myGraphQLSchema
        },
        {
          server: ws,
          path: '/graphql'
        }
      );
    }
    callback(process.env.PORT);
  });
}
