const db = require("../models");
const { withFilter } = require("apollo-server-express");

// todoLists resolvers
module.exports = {
  Mutation: {
    // getTodoList: async (_, { id }) => {
    //   const todoList = await db.TodoList.findById(id);
    // },
    createTodoList: async (parent, { name, projectId }, { pubsub }) => {
      //Create TodoList
      const createdTodoList = await db.TodoList.create({
        name: name,
        project: projectId
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
      await db.Project.findById(projectId).then(project => {
        project.todoLists.push(createdTodoList._id);
        project
          .save()
          .then(project => {
            console.log(`Saved ${project.name}`);
          })
          .catch(err => {
            throw err;
          });
      });

      //notify the subscription
      pubsub.publish("todoListCreated", createdTodoList);

      return createdTodoList;
    }
  },
  Query: {},
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
    }
  }
};
