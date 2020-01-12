//auth resolvers
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    loginUser: async (_, { username_or_email, password }, { req, res }) => {
      // Try to find user in db based on username or email
      let user;
      //check if email exists with email
      await db.User.findOne({ email: username_or_email })
        .then(foundUser => {
          if (foundUser) {
            user = foundUser;
          }
        })
        .catch(err => {
          throw err;
        });
      // If user not found yet, check if it exists with username
      if (!user) {
        await db.User.findOne({ username: username_or_email })
          .then(foundUser => {
            if (foundUser) {
              user = foundUser;
            }
          })
          .catch(err => {
            throw err;
          });
      }
      // If user doesnt exist with username and email, return error
      if (!user) {
        throw new Error("User not found.");
      }

      //Compare passwords, if wrong throw error
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        throw new Error(
          "Couldn't find user with that username/email and password"
        );
      }

      //create JWT ACCESS Token
      const accessToken = await jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "15m" }
      );

      //create refreshToken and save to database of user
      const refreshToken = await jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "5d" }
      );
      user.refreshToken = await refreshToken;
      await user.save();

      // set tokens as httponly cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true
      });
      res.cookie("username", user.username);
      res.cookie("userId", user.id);

      return user.username;
    },
    hello: () => "HELLO WORKS"
  },
  Query: {}
};
