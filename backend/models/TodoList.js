const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  todoItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoItem"
    }
  ],
  startDate: Date,
  dueDate: Date
});

const TodoList = mongoose.model("TodoList", todoListSchema);

module.exports = TodoList;
