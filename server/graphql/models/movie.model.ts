const ActorType = `
type ActorType {
    name: String!
}
`;

const MovieType = `
type MovieType {
    actors: [ActorType]
    releaseDate: String
    slug: String
}`;

export default [ActorType, MovieType];
