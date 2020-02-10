const db = require("../models");
const mongoose = require("mongoose");
const { withFilter } = require("apollo-server-express");
const checkIfAuthenticated = require("../helpers/checkIfAuthenticated");
const { generateRandomId } = require("../helpers/general");

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
    },
    createChecklistItem: async (
      parent,
      { todoItemId, name },
      { req, res, pubsub }
    ) => {
      //check if user is authentiicated
      checkIfAuthenticated(req, res);
      //find the todoitem where the checklist item should be added
      const todoItem = await db.TodoItem.findById(todoItemId);
      if (!todoItem) {
        throw new Error("TodoItem couldn't be found");
      }
      //create a new checklistitem
      const checklistItem = {
        _id: new mongoose.Types.ObjectId(),
        completed: false,
        name: name
      };
      console.log(checklistItem);
      //push checklistitem to the array and save to database
      todoItem.checklist.push(checklistItem);
      todoItem.save().catch(err => {
        throw err;
      });

      //publish updated todoitem to subscription
      pubsub.publish("todoItemUpdated", todoItem);

      return "ChecklistItem added";
    },
    updateChecklistItem: async (
      parent,
      { todoItemId, checklistItemId, checklistItemData },
      { req, res, pubsub }
    ) => {
      //Find the todoitem that the checklistitem is associated to
      const todoItem = await db.TodoItem.findById(todoItemId);
      if (!todoItem) {
        throw new Error("Error on updating checklistItem, todoItem not found.");
      }
      //find the index so we can splice the array and replace with the new data
      let indexofitem = todoItem.checklist.findIndex(
        el => el._id == checklistItemId
      );
      //now replace the item in the array with the new data
      todoItem.checklist.splice(indexofitem, 1, checklistItemData);
      console.log(todoItem);
      todoItem.save().catch(err => {
        throw err;
      });

      //send updated todo to the subsription so it gets refreshed on client
      pubsub.publish("todoItemUpdated", todoItem);
      return "updated successfully ";
    },
    createComment: async (
      parent,
      { todoItemId, content },
      { req, res, pubsub }
    ) => {
      let todoItem = await db.TodoItem.findById(todoItemId);
      if (!todoItem) {
        throw new Error("Couldn't add the comment. Try again later.");
      }
      //create the comment object
      const comment = {
        _id: new mongoose.Types.ObjectId(),
        content: content,
        author: req.userId
      };

      //push the comment to the comments array
      todoItem.comments.push(comment);
      await todoItem.save().catch(err => {
        throw new Error("Couldn't add the comment. Try again later.");
      });

      //refetch so author of comment gets popoulated
      const todoItem2 = await db.TodoItem.findById(todoItemId);

      console.log(todoItem2);
      pubsub.publish("todoItemUpdated", todoItem2);

      // We dont need to return the object because the client will add the comment to state from the subscription
      //TODO Maybe i should change all of this and return the objects instead so the client is not dependent on the subscription
      return "Comment added.";
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
