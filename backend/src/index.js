const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');

const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
// const { PubSub } = require('graphql-subscriptions');
const cors = require('cors');

const path = require('path');

import jwt from 'jsonwebtoken';
import cryptojs from "crypto-js";
import bodyParser from "body-parser";
import _ from "lodash";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import * as Utils from "./utils"
import pubsub from './pubsub'

const logger = require("./utils/logger");
const { graphqlUploadExpress } = require('graphql-upload');

require('./cron-jobs.js');

// const pubsub = new PubSub();

// Create an executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express application
const app = express();

let subscriptionCount = [];

// Create a logging plugin
const loggingPlugin = {
  async requestDidStart(requestContext) {
    // logger.info(`Request started: ${requestContext.request.operationName}`);
    // logger.info(`Query: ${requestContext.request.query}`);
    // logger.info(`Variables: ${JSON.stringify(requestContext.request.variables)}`);

    return {
      async didEncounterErrors(requestContext) {
        for (const err of requestContext.errors) {
          logger.error(`Error: ${err.message}`, { err });
        }
      },
      async willSendResponse(requestContext) {
        // console.log("Response: ", requestContext.response.data)
        // logger.info(`Response: ${JSON.stringify(requestContext.response.data)}`);
      },
    };
  },
};

// Create an Apollo Server instance
const server = new ApolloServer({ 
  schema, 
  plugins: [ApolloServerPluginLandingPageLocalDefault(), loggingPlugin],
  context: ({ req }) => {
    return { req: req.headers };
  },
  formatError: (error) => {
    // Log the error with Winston
    // const { message, locations, path, extensions } = error;
    // logger.error({
    //     message,
    //     locations,
    //     path,
    //     extensions,
    // });
    console.log("formatError :", error)

    return error; // Return the error as-is or modify as needed
  }
});

// Start the server
server.start().then(() => {
  // server.applyMiddleware({ app });

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  // app.use(express.static("/app/uploads"));
  // /images       : path call from URL example localhost:4000/images/xxxx.jpg
  // /app/uploads  : path in container
  app.use('/images', express.static("/app/uploads"));

  app.use(bodyParser.json());
  app.use(bodyParser.json({ type: "text/*" }));
  app.use(bodyParser.urlencoded({ extended: false }));

  const allowedOrigins = [
    'http://localhost:5173', // Example frontend URL
    'http://localhost',      // Another allowed origin
    'http://167.99.75.91',
    'http://167.99.75.91:1984',
    'http://167.99.75.91:5173',
    'http://localhost:1984'
    // Add more origins as needed
  ];

  // Configure CORS
  const corsOptions = {
    // origin: 'http://localhost:5173', // Replace with your frontend URL
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

  app.get('/health', (req, res) => {
    res.status(200).send('Okay! >> ' + subscriptionCount.toString());
  });


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
        
        console.log("onConnect")
      },
      onSubscribe: (ctx, msg) => {
        let {connectionParams, extra} = ctx
        console.log('Client onSubscribe');

        subscriptionCount = [...subscriptionCount, extra.request.headers['sec-websocket-key']]
      },
      onDisconnect: async(ctx, code, reason) => {
        const { connectionParams, extra } = ctx;
        console.log('Client disconnected');

        // const { connectionParams, extra } = ctx;
        // console.log('Client disconnected :', connectionParams, extra.request.headers);
        await Utils.logUserAccess(1, ctx);

        subscriptionCount = _.filter(subscriptionCount, (el)=> el!==extra.request.headers['sec-websocket-key'])


        console.log("onDisconnect")
      },
    },
    wsServer
  );
});
