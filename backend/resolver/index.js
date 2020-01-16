// all resolvers bundled

const authResolver = require("./auth");
const projectResolver = require("./projects");
const todoListResolver = require("./todoLists");
const todoItemResolver = require("./todoItems");

module.exports = {
  Mutation: {
    ...authResolver.Mutation,
    ...projectResolver.Mutation,
    ...todoListResolver.Mutation,
    ...todoItemResolver.Mutation
  },
  Query: {
    ...authResolver.Query,
    ...projectResolver.Query,
    ...todoListResolver.Query,
    ...todoItemResolver.Query
  },
  Subscription: {
    ...todoListResolver.Subscription,
    ...todoItemResolver.Subscription
  }

  //   ...projectResolver
};
