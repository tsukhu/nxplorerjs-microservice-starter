import { Application } from 'express';
import * as http from 'http';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import myGraphQLSchema from '../../graphql/schema';
import { execute } from 'graphql';
import { subscribe } from 'graphql/subscription';
import { SubscriptionServer } from 'subscriptions-transport-ws';

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

    if (process.env.SUBSCRIPTIONS === 'true') {
      // Create subscription server
      SubscriptionServer.create(
        {
          execute,
          subscribe,
          schema: myGraphQLSchema
        },
        {
          server: ws,
          path: '/subscriptions'
        }
      );
      console.log('-------------------------------');
      console.log('Graphql Subscriptions : Enabled');
      console.log('-------------------------------');
    }
    callback(process.env.PORT);
  });
}
