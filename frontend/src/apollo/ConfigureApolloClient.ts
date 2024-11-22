import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

// import { getCookie } from "@/utils"

  // const { usida } = useSelector((state : DefaultRootState) => state.user);
import { store } from '@/stores'

const { mode, REACT_APP_HOST_GRAPHAL } = process.env;

// HTTP link for queries and mutations
const httpLink = createUploadLink({
  uri: 'http://' + REACT_APP_HOST_GRAPHAL + "/graphql", // Replace with your Apollo Server URL
});

// Function to create a WebSocket client with reconnection logic
let wsClient: ReturnType<typeof createClient> | null = null;
const createWsLink = () => {
  wsClient = createClient({
    url: 'ws://' + REACT_APP_HOST_GRAPHAL + "/graphql", // Your Apollo Server WebSocket endpoint
    // connectionParams: {
    //   // Include any additional parameters needed for authentication
    //   authorization: getCookie('usida') ? `Bearer ${ getCookie('usida') }` : '' ,
    // },
    connectionParams: () => {
      const token = store.getState().user.usida;

      console.log("@@@@ connectionParams :", token, store.getState().user.usida)
      return {
        authorization: token ? `Bearer ${token}` : '',
      };
    },
    lazy: true, // Start connecting only when a subscription is initiated
    retryAttempts: 10, // Maximum number of reconnection attempts
    on: {
      connected: () => console.log('WebSocket connected'),
      closed: () => {
        console.log('WebSocket closed, attempting to reconnect...');
        // connectWithRetry();
      },
      error: (error) =>{
        console.error('WebSocket error', error)
        // if (error?.message?.includes('401')) {
        //   console.error('Authentication error. Please re-login.');
        // }
      } 
    },
    shouldRetry: () => !!store.getState().user.usida //true, // Enable automatic retries on disconnection
  });

  let retries = 0;
  const maxRetries = 10; // Maximum number of reconnection attempts
  const retryDelay = 1000; // Delay between reconnection attempts in milliseconds

  const connectWithRetry = () => {
    if (retries < maxRetries) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... (Attempt ${retries + 1}/${maxRetries})`);
        retries++;
        createWsLink(); // Create a new client instance to reconnect
      }, retryDelay);
    } else {
      console.error('Max reconnection attempts reached. Please check your connection.');
    }
  };

  return new GraphQLWsLink(wsClient);
};

// Create the WebSocket link
let wsLink = createWsLink();

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

// Create Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  connectToDevTools: mode === 'development',
});

// Redux Token Listener
store.subscribe(() => {
  const state = store.getState();
  const token = state.user.usida;

  console.log('Redux Token Listener :', state.user);
  if (!token && wsClient) {
    // Close WebSocket connection on logout
    wsClient.dispose();
    wsClient = null;
    // console.log('WebSocket connection closed due to logout :', wsClient);
  } else if (token && !wsClient) {
    // Reinitialize WebSocket connection when token is available
    wsLink = createWsLink();
    // console.log('WebSocket connection reinitialized with new token :', token);
  }
});

export default client;