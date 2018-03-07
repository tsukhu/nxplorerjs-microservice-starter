const ChannelTypeDefs = `
type Channel {
  id: ID!                # "!" denotes a required field
  name: String
  messages: [Message]
  # messages will be returned in a MessageFeed object wrapper
  messageFeed(cursor: String): MessageFeed
}
input MessageInput{
  channelId: ID!
  text: String
}
type Message {
  id: ID!
  text: String
  createdAt: Int
}
type MessageFeed {
  # cursor specifies the place in the list where we left off
  cursor: String!
  # this is a chunk of messages to be returned
  messages: [Message]!
}
`;

export default [ChannelTypeDefs];
