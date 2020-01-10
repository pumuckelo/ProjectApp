// all resolvers bundled

const authResolver = require("./auth");

module.exports = {
  ...authResolver
};
