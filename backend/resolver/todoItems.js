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
    },
    updateTodoItem: async (
      _,
      { name, status, todoItemId, assignedTo },
      { req, res, pubsub }
    ) => {
      checkIfAuthenticated(req, res);
      console.log(assignedTo);

      // If assignedTo is nothing (unassigned function used by client) then dont
      const updatedTodoItem = await db.TodoItem.findByIdAndUpdate(
        todoItemId,
        {
          name: name,
          status: status,
          assignedTo: assignedTo
        },
        { new: true }
      ).catch(err => {
        throw err;
      });
      console.log(updatedTodoItem);
      if (assignedTo) {
        updatedTodoItem.assignedTo = await db.User.findById(
          updatedTodoItem.assignedTo
        );
      }
      //modify so only username and _id get returned
      // updatedTodoItem.assignedTo = await {
      //   username: updatedTodoItem.assignedTo.username,
      //   _id: updatedTodoItem.assignedTo._id
      // };
      // if todo is unassigned, dont populate

      console.log(updatedTodoItem);
      pubsub.publish("todoItemUpdated", updatedTodoItem);
      return updatedTodoItem;
    }
  },
  Query: {
    getTodoItem: async (parent, { id }, { req, res, pubsub }) => {
      // checkIfAuthenticated(req, res);
      const todoItem = await db.TodoItem.findById(id)
        .populate("assignedTo")
        .catch(err => {
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
    },
    todoItemUpdated: {
      resolve: payload => payload,
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("todoItemUpdated"),
        (payload, variables) => {
          return payload._id == variables.todoItemId;
        }
      )
    }
  }
};
