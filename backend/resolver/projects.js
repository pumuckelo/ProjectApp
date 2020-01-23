const db = require("../models/index");
const checkIfAuthenticated = require("../helpers/checkIfAuthenticated");
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
      ///check if invitation already exists
      console.log("createprojectinvitation fired");
      const user = await db.User.findOne({ username: username }).catch(err => {
        throw err;
      });

      const exists = await db.ProjectInvitation.findOne({
        project: projectId,
        invitedUser: user._id
      });

      if (exists) {
        throw new Error("User already invited.");
      }

      const projectInvitation = await db.ProjectInvitation.create({
        project: projectId,
        invitedUser: user
      }).catch(err => {
        throw err;
      });
      await projectInvitation.save();

      return projectInvitation;
    },
    acceptProjectInvitation: async (
      _,
      { projectInvitationId },
      { req, res, pubsub }
    ) => {
      //Find the projectInvitation by the id that was passed as a parameter
      const projectInvitation = await db.ProjectInvitation.findById(
        projectInvitationId
      ).catch(err => {
        throw err;
      });
      //Find the project of the invitation so we can push the user to the members
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
      return "Invitation accepted";
    },
    declineProjectInvitation: async (
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
  }
};
