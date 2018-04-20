// GraphQL Subscription Definitions
const SubscriptionType = `
type SubscriptionType {
    exampleAdded: ExampleType!
    commentAdded(blogId: ID!): Comment
}
`;


export default [SubscriptionType];
