const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type ChecklistItem {
    name: String
    completed: Boolean
  }

  type Comment {
    content: String
    author: User
    created: String
  }

  type TodoItem {
    name: String
    checklist: [ChecklistItem]!
    assignedTo: User
    comments: [Comment]!
    status: String
    notes: String
    startDate: String
    dueDate: String
    todoList: ID
  }

  type User {
    username: String
    email: String
    projects: [ID]!
  }

  type TodoList {
    name: String
    description: String
    todoItems: [TodoItem]!
    startDate: String
    dueDate: String
  }

  type Project {
    name: String
    todoLists: [TodoList]!
    owners: [User]!
    members: [User]!
    startDate: String
    dueDate: String
    status: String
  }

  type Mutation {
    registerUser(username: String, email: String, password: String): String
    loginUser(username_or_email: String, password: String): String
    hello: String
  }

  type Query {
    hello: String
  }
`;

module.exports = typeDefs;
