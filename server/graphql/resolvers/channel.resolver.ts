import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
const faker = require('faker')

const channels = [];
let lastChannelId = 0;
let lastMessageId = 0;
let messageCreatedAt = 123456789;

const addChannel = (name) => {
  lastChannelId++;
  const newChannel = {
    id: String(lastChannelId),
    name: name,
    messages: []
  };
  channels.push(newChannel);
  return lastChannelId;
};

const getChannel = (id) => {
  return channels.find(channel => channel.id === id);
};

const addFakeMessage = (channel, messageText) => {
  lastMessageId++;
  messageCreatedAt++;
  const newMessage = {
    id: lastMessageId,
    createdAt: messageCreatedAt,
    text: messageText
  };
  channel.messages.push(newMessage);
};

// use faker to generate random messages in faker channel
addChannel('faker');
const fakerChannel = channels.find(channel => channel.name === 'faker');

// Add seed for consistent random data
faker.seed(9);
for (let i = 0; i < 50; i++) {
  addFakeMessage(fakerChannel, faker.random.words());
}

// generate second channel for initial channel list view
addChannel('channel2');

const pubsub = new PubSub();

export default {
  RootQueryType: {
    channels: () => {
      return channels;
    },

    channel: (root, { id }) => {
      return getChannel(id);
    }
  },
  // The new resolvers are under the Channel type
  Channel: {
    messageFeed: (channel, { cursor }) => {
      // The cursor passed in by the client will be an
      // integer timestamp. If no cursor is passed in,
      // set the cursor equal to the time at which the
      // last message in the channel was created.
      if (!cursor) {
        cursor = channel.messages[channel.messages.length - 1].createdAt;
      }

      cursor = parseInt(cursor);
      // limit is the number of messages we will return.
      // We could pass it in as an argument but in this
      // case let's use a static value.
      const limit = 10;

      const newestMessageIndex = channel.messages.findIndex(
        message => message.createdAt === cursor
      ); // find index of message created at time held in cursor
      // We need to return a new cursor to the client so that it
      // can find the next page. Let's set newCursor to the
      // createdAt time of the last message in this messageFeed:
      const newCursor = channel.messages[newestMessageIndex - limit].createdAt;

      const messageFeed = {
        messages: channel.messages.slice(
          newestMessageIndex - limit,
          newestMessageIndex
        ),
        cursor: newCursor
      };

      return messageFeed;
    }
  },
  RootMutationType: {
    addChannel: (root, args) => {
      const name = args.name;
      const id = addChannel(name);
      return getChannel(id);
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(
        channel => channel.id === message.channelId
      );
      if (!channel) throw new Error('Channel does not exist');

      const newMessage = {
        id: String(lastMessageId++),
        text: message.text,
        createdAt: +new Date()
      };
      channel.messages.push(newMessage);

      pubsub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId
      });

      return newMessage;
    }
  },
  SubscriptionType: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          // The `messageAdded` channel includes events for all channels, so we filter to only
          // pass through events for the channel specified in the query
          return payload.channelId === variables.channelId;
        }
      )
    }
  }
};
