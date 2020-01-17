const db = require("../models");
const { withFilter } = require("apollo-server-express");
const checkIfAuthenticated = require("../helpers/checkIfAuthenticated");

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
  Query: {
    getTodoItem: async (parent, { id }, { req, res, pubsub }) => {
      // checkIfAuthenticated(req, res);
      const todoItem = await db.TodoItem.findById(id).catch(err => {
        throw err;
      });
      console.log(todoItem);
      return todoItem;
    }
  },
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
