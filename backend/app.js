require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const typeDefs = require("./schema/index");
const resolvers = require("./resolver/index");
const { ApolloServer, gql } = require("apollo-server-express");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
});

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Damit Cors funktioniert musst du noch bei dem Apollo Server
// cors ausschalten

app.use(express.json());

server.applyMiddleware({ app });
mongoose.connect(
  process.env.DATABASE_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to database");
  }
);
app.listen(process.env.APPLICATION_PORT, () => {
  console.log("Server started on Port " + process.env.APPLICATION_PORT);
});
