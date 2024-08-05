// apolloClient.ts
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from 'apollo-upload-client'; // v15.0.0

// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000/graphql', // Your Apollo Server HTTP endpoint
// });

const httpLink = createUploadLink({
  uri: 'http://localhost:4000/graphql', // Replace with your Apollo Server URL
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql', // Your Apollo Server WebSocket endpoint
  })
);

// Combine the HTTP link and WebSocket link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
