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
export function configGraphQLSubscription(app,callback) {
    const ws = http.createServer(app);
    ws.listen(process.env.PORT, () => {
      callback(process.env.PORT);
    });
  
    const subscriptionServer = new SubscriptionServer({
      execute,
      subscribe,
      schema: myGraphQLSchema
    }, {
        server: ws,
        path: '/subscriptions',
      });
  

}
