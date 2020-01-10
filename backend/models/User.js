const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  refreshToken: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
