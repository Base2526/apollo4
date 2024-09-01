// apolloClient.ts
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000/graphql', // Your Apollo Server HTTP endpoint
// });

// import.meta.env.DEV

const httpLink = createUploadLink({
  // uri: 'http://' + import.meta.env.VITE_HOST_GRAPHAL + "/graphql", // Replace with your Apollo Server URL
  uri: 'http://localhost:1984/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    // url: 'ws://' + import.meta.env.VITE_HOST_GRAPHAL + "/graphql", // Your Apollo Server WebSocket endpoint
    url: 'ws://localhost:1984/graphql',
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
