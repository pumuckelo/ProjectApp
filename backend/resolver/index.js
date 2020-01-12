// all resolvers bundled

const authResolver = require("./auth");
const projectResolver = require("./projects");

module.exports = {
  Mutation: {
    ...authResolver.Mutation,
    ...projectResolver.Mutation
  },
  Query: {
    ...authResolver.Query,
    ...projectResolver.Query
  }

  //   ...projectResolver
};
