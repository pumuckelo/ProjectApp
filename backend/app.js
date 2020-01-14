require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/auth-middleware");
const typeDefs = require("./schema/index");
const resolvers = require("./resolver/index");
const http = require("http");
const {
  ApolloServer,
  gql,
  PubSub,
  withFilter
} = require("apollo-server-express");

const app = express();
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  context: ({ req, res }) => {
    return { req, res, pubsub, withFilter };
  }
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Damit Cors funktioniert musst du noch bei dem Apollo Server
// cors ausschalten

app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

server.applyMiddleware({ app, cors: false });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);
mongoose.connect(
  process.env.DATABASE_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to database");
  }
);
httpServer.listen(process.env.APPLICATION_PORT, () => {
  console.log("Server started on Port " + process.env.APPLICATION_PORT);
});
