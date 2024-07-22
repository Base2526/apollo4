const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');

const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');
const cors = require('cors');

import jwt from 'jsonwebtoken';
import cryptojs from "crypto-js";
import bodyParser from "body-parser";
import _ from "lodash";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import * as Utils from "./utils"

require('./cron-jobs.js');

const pubsub = new PubSub();

// Define your type definitions (schema)
// const typeDefs = `
//   type Query {
//     hello: String,
//     healthCheck: String
//   }

//   type Subscription {
//     userConnected: String
//   }
// `;

// // Define your resolvers
// const resolvers = {
//   Query: {
//     hello: () => 'Hello world!',
//     healthCheck: () => {
//       console.log("healthCheck :OK")
//       return 'OK'
//     },
//   },
//   Subscription: {
//     userConnected: {
//       subscribe: () => pubsub.asyncIterator(['USER_CONNECTED']),
//     },
//   },
// };

// Create an executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express application
const app = express();

// Create an Apollo Server instance
const server = new ApolloServer({ 
  schema, 
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
  context: ({ req }) => {
    return { req: req.headers };
  },
});

// Start the server
server.start().then(() => {
  // server.applyMiddleware({ app });

  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: "text/*" }));
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure CORS
  const corsOptions = {
    origin: 'http://localhost', // Replace with your frontend URL
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  
  // Apply middleware to the Express app
  app.use('/graphql', expressMiddleware(
                    server , 
                    { context: async ({ req }) => ({ req: req.headers }),}));

  // app.use(express.json()); // This line adds JSON parsing middleware


  // Create an HTTP server
  const httpServer = app.listen(4000, () => {
    console.log('Server is now running on http://localhost:4000/graphql');
  });

  // Create a WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Use the WebSocket server with graphql-ws
  useServer(
    {
      schema,
      onConnect: async(ctx) => {
        const { connectionParams, extra } = ctx;
        // console.log('Client connected : ', connectionParams, extra.request.headers, extra.request.headers['sec-websocket-key']);
        pubsub.publish('USER_CONNECTED', { userConnected: 'A user connected' });

        await Utils.logUserAccess(0, ctx);
        
      },
      onDisconnect: async(ctx, code, reason) => {
        // const { connectionParams, extra } = ctx;
        // console.log('Client disconnected :', connectionParams, extra.request.headers);
        await Utils.logUserAccess(1, ctx);
      },
    },
    wsServer
  );
});
