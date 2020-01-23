const User = require("./User");
const TodoList = require("./TodoList");
const TodoItem = require("./TodoItem");
const Project = require("./Project");
const ProjectInvitation = require("./ProjectInvitation");

const db = {
  User,
  TodoList,
  TodoItem,
  Project,
  ProjectInvitation
};

module.exports = db;
