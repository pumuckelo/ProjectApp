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

  type ProjectInvitation {
    _id: ID
    project: ID
    invitedUser: ID
  }

  type ProjectInvitationPopulatedProject {
    _id: ID
    project: Project
    invitedUser: ID
  }

  type ProjectInvitationPopulatedUser {
    _id: ID
    project: ID
    invitedUser: User
  }

  type Mutation {
    registerUser(username: String, email: String, password: String): String
    loginUser(username_or_email: String, password: String): String
    logoutUser: String
    hello: String
    createProjectTest(name: String, owner: String): String
    createProject(name: String): Project
    createProjectInvitation(
      projectId: String
      username: String
    ): ProjectInvitation
    acceptProjectInvitation(projectInvitationId: ID): String
    declineProjectInvitation(projectInvitationId: ID): String
    createTodoList(name: String, projectId: ID): TodoList
    updateTodoList(
      todoListId: ID
      name: String
      description: String
      startDate: String
      dueDate: String
    ): TodoList
    deleteTodoList(todoListId: ID): TodoList
    createTodoItem(name: String, todoListId: ID): TodoItem
    updateTodoItem(todoItemId: ID, name: String, status: String): TodoItem
  }

  type Query {
    hello: String
    myProjects: [Project]
    getProject(id: ID): Project
    getProjectInvitations(projectId: ID): [ProjectInvitationPopulatedUser]
    myProjectInvitations: [ProjectInvitationPopulatedProject]
    getTodoList(id: ID): TodoList
    getTodoItem(id: ID): TodoItem
  }

  type Subscription {
    todoListCreated(projectId: ID): TodoList
    todoListDeleted(projectId: ID): TodoList
    todoListUpdated(todoListId: ID): TodoList
    todoItemCreated(todoListId: ID): TodoItem
    todoItemUpdated(todoItemId: ID): TodoItem
    userInvited(userId: ID): ProjectInvitation
  }
`;

module.exports = typeDefs;
