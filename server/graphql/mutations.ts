// GraphQL Mutation Definitions
const RootMutationType = `
type RootMutationType { 
    addExample(name: String!): ExampleType
    login( email: String!, password: String!, role: String): UserType
    addBlog(name: String!): Blog
    addComment(comment: CommentInput!): Comment
}`;

export default [RootMutationType];