const ExampleType = `
type ExampleType {
    id: Int! 
    name: String
}
`;



const ExampleArrayType = `
type ExampleArrayType {
    list: [ExampleType]
}
`;



export default [ExampleType, ExampleArrayType];
