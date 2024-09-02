// apolloClient.ts
import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { HttpLink } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  // uri: 'http://' + import.meta.env.VITE_HOST_GRAPHAL + "/graphql", // Replace with your Apollo Server URL
  uri: 'http://167.99.75.91:1984/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    // url: 'ws://' + import.meta.env.VITE_HOST_GRAPHAL + "/graphql", // Your Apollo Server WebSocket endpoint
    url: 'ws://167.99.75.91:1984/graphql',
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
