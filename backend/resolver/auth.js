//auth resolvers
const db = require("../models");
const bcrypt = require("bcryptjs");

module.exports = {
  Mutation: {
    registerUser: async (_, { username, email, password }) => {
      //Check if username already exists
      await db.User.findOne({ username: username })
        .then(foundUser => {
          if (foundUser) {
            throw new Error(`User already exists.`);
          }
        })
        .catch(err => {
          throw err;
        });

      //Check if email already exists
      await db.User.findOne({ email: email })
        .then(foundUser => {
          if (foundUser) {
            throw new Error(`E-Mail already being used.`);
          }
        })
        .catch(err => {
          throw err;
        });

      // User doesnt exist, now create the User

      // First we need to hash the password
      const hashedPassword = await bcrypt.hash(password, 13);

      //Create the User and save it to the database
      return db.User.create({
        username: username,
        email: email,
        password: hashedPassword
      }).then(createdUser => {
        createdUser.save();
        //Return a string for the graphql mutation
        return `Created "${createdUser.username}" with "${createdUser.email}"`;
      });
    },
    loginUser: () => {},
    hello: () => "HELLO WORKS"
  }
  //   Query: {
  //     test: () => {}
  //   }
};
