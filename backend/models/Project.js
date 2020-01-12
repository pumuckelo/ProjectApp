const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startDate: String,
  dueDate: String,
  status: String,
  todoLists: [{ type: mongoose.Schema.Types.ObjectId, ref: "TodoList" }],
  owners: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ]
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
