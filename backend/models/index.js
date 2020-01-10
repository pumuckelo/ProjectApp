const User = require("./User");
const TodoList = require("./TodoList");
const TodoItem = require("./TodoItem");
const Project = require("./Project");

const db = {
  User,
  TodoList,
  TodoItem,
  Project
};

module.exports = db;
