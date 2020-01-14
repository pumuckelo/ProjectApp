// all resolvers bundled

const authResolver = require("./auth");
const projectResolver = require("./projects");
const todoListResolver = require("./todoLists");

module.exports = {
  Mutation: {
    ...authResolver.Mutation,
    ...projectResolver.Mutation,
    ...todoListResolver.Mutation
  },
  Query: {
    ...authResolver.Query,
    ...projectResolver.Query,
    ...todoListResolver.Query
  },
  Subscription: {
    ...todoListResolver.Subscription
  }

  //   ...projectResolver
};
