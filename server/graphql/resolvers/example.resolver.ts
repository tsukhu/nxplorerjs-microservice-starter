import ExampleService from '../../api/services/examples.service';

/**
 * Examples GraphQL resolver
 */
export default {

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
        addExample(parent, args, context, info) {
            return ExampleService.create(args.name);
        }
    }
};

