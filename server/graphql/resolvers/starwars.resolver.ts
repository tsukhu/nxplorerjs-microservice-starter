/**
 * Starwars GraphQL resolver
 */
export default {
  RootQueryType: {
    peopleWithPlanet(parent, args, context, info) {
      return context.peopleWithPlanetLoader.load(args.id);
    },
    people(parent, args, context, info) {
      return context.peopleLoader.load(args.id);
    },
    peopleList(parent, args, context, info) {
        return context.peopleLoader.loadMany(args.keys);
      },
    planet(parent, args, context, info) {
      return context.planetLoader.load(args.id);
    },
    starship(parent, args, context, info) {
      return context.starshipLoader.load(args.id);
    }
  }
};
