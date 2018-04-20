// GraphQL Query Definitions
const RootQueryType = `
directive @date(
  defaultFormat: String = "mmmm d, yyyy"
) on FIELD_DEFINITION

scalar Date

type RootQueryType { 
    quoteOfTheDay: String 
    random: Float 
    rollThreeDice: [Int] 
    peopleWithPlanet (id: Int!) : PeopleWithPlanetType 
    """
      Schema directive based example
    """
    today: Date @date
    people (id: Int!) : PeopleType
    peopleList(keys: [Int]): [PeopleType]
    peopleMock:  PeopleType
    planet (id: Int!) : PlanetType
    starship (id: Int!) : StarshipType 
    example (id: Int!) : ExampleType
    exampleMock: ExampleType
    examplesMock: [ExampleType] 
    examples: [ExampleType]
    movie: MovieType
    blogs: [Blog]    # "[]" means this is a list of blogs
    blog(id: ID!): Blog
}`;

export default [RootQueryType];