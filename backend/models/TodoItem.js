const mongoose = require("mongoose");

const todoItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  checklist: [
    {
      _id: mongoose.Schema.Types.ObjectId,
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
      _id: mongoose.Schema.Types.ObjectId,
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

const autoPopulateAssignedToAndCommentsAuthor = function(next) {
  this.populate("assignedTo");
  // this.populate("author");

  this.populate({
    path: "comments.author",
    model: "User"
  });
  next();
};

todoItemSchema
  .pre("findOne", autoPopulateAssignedToAndCommentsAuthor)
  .pre("find", autoPopulateAssignedToAndCommentsAuthor);

const TodoItem = mongoose.model("TodoItem", todoItemSchema);

module.exports = TodoItem;
