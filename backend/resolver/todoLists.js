const db = require("../models");

// todoLists resolvers
module.exports = {
  Mutation: {
    getTodoList: async (_, { id }) => {
      const todoList = await db.TodoList.findById(id);
    }
  },
  Query: {}
};
