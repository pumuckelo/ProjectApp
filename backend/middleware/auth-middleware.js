const jwt = require("jsonwebtoken");
const db = require("../models");
const authMiddleware = async (req, res, next) => {
  //get AccessToken
  let accessToken = await req.cookies.accessToken;
  let refreshToken = await req.cookies.refreshToken;

  if (accessToken) {
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_KEY,
      async (err, decodedAccessToken) => {
        // if acccessToken expired, check refresh token
        if (err) {
          console.log("Access token expired");
          //if refresh token is correct, set data of refresh token to userData so it can be used
          // to sign a new accessToken
          // if not, next will be called and client cookies get cleared
          const userData = await checkRefreshToken(
            refreshToken,
            req,
            res,
            next
          );
          createNewAccessToken(userData, req, res);
          next();
        }
        // else set the userId to  the id of the user of the token
        else {
          console.log("Great, Access Token valid");
          req.userId = decodedAccessToken.id;
          next();
        }
      }
    );
  } else {
    // console.log("No token found");
    next();
  }
};

//-- Functions --

const checkRefreshToken = async (refreshToken, req, res, next) => {
  let refreshTokenCorrect;
  let data = {};
  await jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_KEY,
    async (err, decodedRefreshToken) => {
      //if refreshToken is invalid, reset the token cookies of the user
      //and send unauthorized status code
      if (err) {
        console.log("Invalid Refreshtoken");
        res.cookie("accessToken", "");
        res.cookie("refreshToken", "");
        res.cookie("userId", "");
        res.cookie("username", "");
        res.sendStatus(401);
        next();
      }
      //if Token is valid, check if its the same as in the user database
      else {
        let databaseRefreshToken;
        await db.User.findById(decodedRefreshToken.id).then(user => {
          databaseRefreshToken = user.refreshToken;
        });

        //compare tokens, if tokens are the same, prepare object for new accesToken

        if (refreshToken == databaseRefreshToken) {
          console.log("RefreshToken correct");
          //Set the userID for the request
          req.userId = decodedRefreshToken.id;
          data = {
            id: decodedRefreshToken.id,
            username: decodedRefreshToken.username,
            email: decodedRefreshToken.email
          };
        } else {
          console.log("DB: Wrong refreshtoken, cleared cookies");
          res.cookie("accessToken", "");
          res.cookie("refreshToken", "");
          res.cookie("userId", "");
          res.cookie("username", "");
          res.sendStatus(401);
          next();
          return;
        }
      }
    }
  );
  return data;
};

const createNewAccessToken = async (userData, req, res) => {
  console.log("Starting to create new Access Token");
  let newAccessToken = await jwt.sign(userData, process.env.JWT_ACCESS_KEY, {
    expiresIn: "15s"
  });
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true
  });
  console.log("Refreshed AccessToken ");
};

module.exports = authMiddleware;
