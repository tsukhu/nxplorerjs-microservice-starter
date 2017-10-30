const PeopleWithPlanetType = `
type PeopleWithPlanetType {
    name: String
    height: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    homeworld: PlanetType
    films: [String]
    species: [String]
    vehicles: [String]
    starships: [String]
    created: String
    edited: String
    url: String
}`;

const PeopleType = `
type PeopleType {
    name: String 
    height: String 
    mass: String 
    hair_color: String 
    skin_color: String 
    eye_color: String 
    birth_year: String 
    gender: String 
    homeworld: String 
    films: [String] 
    species: [String] 
    vehicles: [String] 
    starships: [String] 
    created: String 
    edited: String 
    url: String
}`;

const PlanetType = `
type PlanetType { 
    name: String 
    rotation_period: String 
    orbital_period: String 
    diameter: String 
    climate: String 
    gravity: String 
    terrain: String 
    surface_water: String 
    population: String 
    residents: [String] 
    films: [String] 
    created: String 
    edited: String 
    url: String
}`;


export default () => [PlanetType, PeopleType, PeopleWithPlanetType];