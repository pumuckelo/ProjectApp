const mongoose = require("mongoose");

const todoItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  checklist: [
    {
      _id: {
        type: String,
        unique: true
      },
      name: String,
      completed: false
    }
  ],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  comments: [
    {
      content: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      created: {
        type: Date,
        default: Date.now
      }
    }
  ],
  status: {
    type: String,
    default: "notstarted"
  },
  notes: String,
  startDate: Date,
  dueDate: Date,
  todoList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TodoList"
  }
});

const autoPopulateAssignedTo = function(next) {
  this.populate("assignedTo");
  next();
};

todoItemSchema
  .pre("findOne", autoPopulateAssignedTo)
  .pre("find", autoPopulateAssignedTo);

const TodoItem = mongoose.model("TodoItem", todoItemSchema);

module.exports = TodoItem;
