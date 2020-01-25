const mongoose = require("mongoose");

const projectInvitationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  invitedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

projectInvitationSchema.index(
  {
    project: 1,
    invitedUser: 1
  },
  { unique: true }
);

const ProjectInvitation = mongoose.model(
  "ProjectInvitation",
  projectInvitationSchema
);

module.exports = ProjectInvitation;
