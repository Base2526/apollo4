// apolloClient.ts

import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider as ApolloProviderComponent, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create a link to your GraphQL server
const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql', // Replace with your GraphQL endpoint
});

// Set up the authentication link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token'); // Adjust based on how you store your token
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create an Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Define the props for the ApolloProviderWrapper component
interface ApolloProviderProps {
  children: React.ReactNode;
}

// Create a wrapper component for ApolloProvider
const ApolloProviderWrapper: React.FC<ApolloProviderProps> = ({ children }) => {
  return <ApolloProviderComponent client={client}>{children}</ApolloProviderComponent>;
};

// Export the client and wrapper component
export { client, ApolloProviderWrapper };
