import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

const { PROD, VITE_HOST_GRAPHAL }  = import.meta.env

const httpLink = createUploadLink({
  uri: 'http://' + VITE_HOST_GRAPHAL + "/graphql", // Replace with your Apollo Server URL
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://' + VITE_HOST_GRAPHAL + "/graphql", // Your Apollo Server WebSocket endpoint
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
  connectToDevTools: PROD
});

export default client;