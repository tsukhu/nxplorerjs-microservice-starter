import { PubSub } from 'graphql-subscriptions';
import container from '../../common/config/ioc_config';
import SERVICE_IDENTIFIER from '../../common/constants/identifiers';

import IExample from '../../api/interfaces/iexample';

const ExampleService = container.get<IExample>(SERVICE_IDENTIFIER.EXAMPLE);

export const pubsub = new PubSub();

const EXAMPLE_ADDED = 'EXAMPLE_ADDED';
/**
 * Examples GraphQL resolver
 */
export default {

    SubscriptionType: {
        exampleAdded: {
            subscribe: () => pubsub.asyncIterator(EXAMPLE_ADDED),
        }
    },

    RootQueryType: {

        quoteOfTheDay(parent, args, context, info) {
            return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
        },
        random(parent, args, context, info) {
            return Math.random();
        },
        rollThreeDice(parent, args, context, info) {
            return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
        },
        example(parent, args, context, info) {
            return ExampleService.byId(args.id);
        },
        examples(parent, args, context, info) {
            return ExampleService.all();
        }
    },
    RootMutationType: {
        addExample: async (parent, args, context, info) => {
            const exampleAdded = await ExampleService.create(args.name);
            pubsub.publish(EXAMPLE_ADDED, { exampleAdded: exampleAdded });
            return exampleAdded;
        }
    }
};

