const db = require("../models");
const { withFilter } = require("apollo-server-express");

module.exports = {
  Mutation: {
    createTodoItem: async (_, { name, todoListId }, { req, res, pubsub }) => {
      //create TodoItem
      const todoItem = await db.TodoItem.create({
        name: name,
        todoList: todoListId
      }).catch(err => {
        throw err;
      });

      //  find associated todoList
      const todoList = await db.TodoList.findById(todoListId).catch(err => {
        throw err;
      });
      await todoList.todoItems.push(todoItem);
      await todoList.save();

      //Push new TodoItem to subscription
      pubsub.publish("todoItemCreated", todoItem);

      return todoItem;
    }
  },
  Query: {},
  Subscription: {
    todoItemCreated: {
      resolve: payload => payload,
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("todoItemCreated"),
        (payload, variables) => {
          if (payload.todoList == variables.todoListId) {
            console.log("Correct Match");
          } else {
            console.log("NoMatch");
          }
          return payload.todoList == variables.todoListId;
        }
      )
    }
  }
};
