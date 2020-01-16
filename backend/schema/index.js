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
    _id: ID!
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
    _id: ID!
    username: String
    email: String
    projects: [ID]!
  }

  type TodoList {
    _id: ID!
    name: String
    description: String
    todoItems: [ID]!
    startDate: String
    dueDate: String
    project: ID
  }

  type Project {
    _id: ID!
    name: String!
    todoLists: [ID]!
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
    createProjectTest(name: String, owner: String): String
    createProject(name: String): String
    createTodoList(name: String, projectId: ID): TodoList
    createTodoItem(name: String, todoListId: ID): TodoItem
  }

  type Query {
    hello: String
    myProjects: [Project]
    getProject(id: String): Project
    getTodoList(id: ID): TodoList
  }

  type Subscription {
    todoListCreated(projectId: ID): TodoList
    todoItemCreated(todoListId: ID): TodoItem
  }
`;

module.exports = typeDefs;
