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
        member: [req.userId]
      }).then(project => {
        createdProject = project;
      });

      //save projectid to user.projects
      await db.User.findById(req.userId).then(foundUser => {
        foundUser.projects.push(createdProject.id);
        foundUser.save();
      });

      if (createdProject) {
        return `Created Project "${createdProject.name}"`;
      }
    }
  },
  Query: {}
};
