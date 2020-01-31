const db = require("../models/index");
const checkIfAuthenticated = require("../helpers/checkIfAuthenticated");
const { withFilter } = require("apollo-server-express");

//project resolvers

module.exports = {
  Mutation: {
    createProjectTest: async (_, { name, owner }) => {
      //create project
      let createdProject;
      await db.Project.create({
        name: name,
        owners: [owner],
        members: [owner]
      }).then(project => {
        createdProject = project;
        project.save();
      });

      await db.User.findById(owner).then(foundUser => {
        foundUser.projects.push(createdProject.id);
        foundUser.save();
        console.log(foundUser.projects);
      });

      if (createdProject) {
        return `Created Project ${createdProject.name}`;
      }

      //add createdproject to user.projects
    },
    createProject: async (_, { name }, { req, res }) => {
      checkIfAuthenticated(req, res);
      let createdProject;
      //create Project with req.userId as  owner and member
      await db.Project.create({
        name: name,
        owners: [req.userId],
        members: [req.userId]
      }).then(project => {
        createdProject = project;
      });

      //save projectid to user.projects
      await db.User.findById(req.userId).then(foundUser => {
        foundUser.projects.push(createdProject.id);
        foundUser.save();
      });
      console.log("jo angekommen");
      if (createdProject) {
        return createdProject;
      }
    },
    createProjectInvitation: async (
      parent,
      { projectId, username },
      { req, res, pubsub }
    ) => {
      ///check if the added User exists
      console.log("createprojectinvitation fired");
      const user = await db.User.findOne({ username: username }).catch(err => {
        throw new Error(`Couldn't find user "${username}"`);
      });

      if (!user) {
        throw new Error(`Couldn't find user "${username}"`);
      }

      // get the project so we can later push this to subscription
      const project = await db.Project.findById(projectId).catch(err => {
        throw new Error("Couldn't find project");
      });

      //check if user is already member of project
      if (project.members.includes(user._id)) {
        throw new Error(`${username} is already member of the project`);
      }

      //check if invitation already exists
      const exists = await db.ProjectInvitation.findOne({
        project: projectId,
        invitedUser: user._id
      });
      if (exists) {
        throw new Error("User already invited.");
      }

      //create the invitation
      const projectInvitation = await db.ProjectInvitation.create({
        project: projectId,
        invitedUser: user._id
      }).catch(err => {
        throw err;
      });
      await projectInvitation.save();
      // send new invitation to the susbcriptions
      pubsub.publish("userInvited", {
        invitedUser: user._id,
        project: project
      });
      pubsub.publish("projectInvitationCreated", {
        _id: projectInvitation._id,
        project: projectInvitation.project,
        invitedUser: user
      });

      return projectInvitation;
    },
    acceptProjectInvitation: async (
      _,
      { projectInvitationId },
      { req, res, pubsub }
    ) => {
      //Find the projectInvitation by the id that was passed as a parameter
      console.log(projectInvitationId);
      const projectInvitation = await db.ProjectInvitation.findById(
        projectInvitationId
      ).catch(err => {
        throw err;
      });

      //Find the project of the invitation so we can push the user to the members
      console.log(projectInvitation);
      const project = await db.Project.findById(
        projectInvitation.project
      ).catch(err => {
        throw err;
      });
      await project.members.addToSet(projectInvitation.invitedUser);
      await project.save().catch(err => {
        throw err;
      });

      //find the user that was invited to add the project to his projects
      const user = await db.User.findById(projectInvitation.invitedUser).catch(
        err => {
          throw err;
        }
      );
      await user.projects.push(project);
      await user.save().catch(err => {
        throw err;
      });

      //After accepting the invite should be deleted
      await db.ProjectInvitation.findByIdAndDelete(projectInvitationId).catch(
        err => {
          throw err;
        }
      );

      //TODO NEED TO FIRE SUBSCRIPTION FOR USER ADDED
      return "Invitation accepted";
    },
    deleteProjectInvitation: async (
      _,
      { projectInvitationId },
      { req, res, pubsub }
    ) => {
      await db.ProjectInvitation.findByIdAndDelete(projectInvitationId).catch(
        err => {
          throw err;
        }
      );

      return "";
    },
    removeMember: async (
      parent,
      { userId, projectId },
      { req, res, pubsub }
    ) => {
      //check if user that send request is owner

      //find project
      const project = await db.Project.findById(projectId);
      //remove the user from members
      project.members = await project.members.filter(
        member => member != userId
      );
      //also remove user from owners
      project.owners = await project.owners.filter(owner => owner != userId);
      project.save().catch(err => {
        throw new Error("Couldn't remove Member");
      });

      //remove the project from user
      const user = await db.User.findById(userId);
      user.projects = await user.projects.filter(
        project => project != projectId
      );
      user.save().catch(err => {
        throw new Error("Couldn't remove Member");
      });

      //TODO need to fire subscription for user removed

      //this sends the projectid and userid of removed user to the subscription, so the client project can listen.
      //client project listens to subscriptions for the project id and then gets notified if something gets published with the
      //associated projectid. the client then gets the userid of the removed user and can remove the userid from the state for example
      pubsub.publish("memberRemoved", {
        projectId: projectId,
        userId: userId
      });
    }
  },
  Query: {
    // will be used to display a list of the projects of the user
    // without much detail (only name and id)
    myProjects: async (_, args, { req, res }) => {
      checkIfAuthenticated(req, res);
      //search for projects of the user and return only id and name of the projects
      const user = await db.User.findById(req.userId).populate(
        "projects",
        "name"
      );

      return user.projects;
    },
    getProject: async (_, { id }, { req, res }) => {
      //find project
      const project = await db.Project.findById(id)
        // .populate({
        //   path: "todoLists",
        //   populate: { path: "todoItems" }
        // })
        .populate("owners")
        .populate("members");

      return project;
    },
    getProjectInvitations: async (
      parent,
      { projectId },
      { req, res, pubsub }
    ) => {
      //find all project invitations for the project so you can list pending invites
      // in project settings
      const projectInvitations = await db.ProjectInvitation.find({
        project: projectId
      })
        .populate("invitedUser")
        .catch(err => {
          throw err;
        });

      return projectInvitations;
    },
    myProjectInvitations: async (parent, args, { req, res, pubsub }) => {
      checkIfAuthenticated(req, res);
      const myInvitations = await db.ProjectInvitation.find({
        invitedUser: req.userId
      })
        .populate("project")
        .catch(err => {
          throw err;
        });
      return myInvitations;
    }
  },
  Subscription: {
    userInvited: {
      resolve: payload => payload,
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("userInvited"),
        (payload, variables) => {
          return payload.invitedUser == variables.userId;
        }
      )
    },
    projectInvitationCreated: {
      resolve: payload => payload,
      subscribe: withFilter(
        (parent, args, { pubsub }) =>
          pubsub.asyncIterator("projectInvitationCreated"),
        (payload, variables) => {
          return payload.project == variables.projectId;
        }
      )
    },
    memberRemoved: {
      resolve: payload => payload.userId,
      subscribe: withFilter(
        (parent, args, { pubsub }) => pubsub.asyncIterator("memberRemoved"),
        (payload, variables) => {
          return payload.projectId == variables.projectId;
        }
      )
    }
  }
};
