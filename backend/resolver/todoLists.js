const db = require("../models");
const { withFilter } = require("apollo-server-express");
const checkIfAuthenticated = require("../helpers/checkIfAuthenticated");

// todoLists resolvers
module.exports = {
  Mutation: {
    // getTodoList: async (_, { id }) => {
    //   const todoList = await db.TodoList.findById(id);
    // },
    createTodoList: async (
      parent,
      { name, projectId },
      { pubsub, req, res }
    ) => {
      // checkIfAuthenticated(req, res);
      //Create TodoList
      const createdTodoList = await db.TodoList.create({
        name: name,
        project: projectId
      }).catch(err => {
        throw err;
      });
      createdTodoList
        .save()
        .then(todoList => {
          console.log(`Created ${todoList.name}`);
        })
        .catch(err => {
          throw err;
        });

      //Push todoList to the pproject
      await db.Project.findById(projectId)
        .then(project => {
          project.todoLists.push(createdTodoList._id);
          project
            .save()
            .then(project => {
              console.log(`Saved ${project.name}`);
            })
            .catch(err => {
              throw err;
            });
        })
        .catch(err => {
          throw err;
        });

      //notify the subscription
      pubsub.publish("todoListCreated", createdTodoList);

      return createdTodoList;
    },
    updateTodoList: async (
      parent,
      { todoListId, name, description, startDate, dueDate },
      { req, res, pubsub }
    ) => {
      const updatedTodoList = await db.TodoList.findByIdAndUpdate(
        todoListId,
        {
          name,
          description,
          startDate,
          dueDate
        },
        { new: true }
      ).catch(err => {
        throw err;
      });
      pubsub.publish("todoListUpdated", updatedTodoList);
      return updatedTodoList;
    }
  },
  Query: {
    getTodoList: async (_, { id }, { req, res }) => {
      console.log(id);
      checkIfAuthenticated(req, res);
      const todoList = await db.TodoList.findById(id);
      console.log(todoList);
      return todoList;
    }
  },
  Subscription: {
    todoListCreated: {
      resolve: payload => payload,
      subscribe: withFilter(
        (_, args, { pubsub }) => pubsub.asyncIterator("todoListCreated"),
        (payload, variables) => {
          console.log(payload);
          console.log(variables);

          if (payload.project == variables.projectId) {
            console.log("CORRECT MATCH");
          }
          return payload.project == variables.projectId;
        }
      )
    },
    todoListUpdated: {
      resolve: payload => payload,
      subscribe: withFilter(
        (_, args, { pubsub }) => pubsub.asyncIterator("todoListUpdated"),
        (payload, variables) => {
          return payload._id == variables.todoListId;
        }
      )
    }
  }
};
