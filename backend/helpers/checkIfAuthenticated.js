const checkIfAuthenticated = (req, res) => {
  if (!req.userId) {
    res.sendStatus(401);
    return;
  }
};
module.exports = checkIfAuthenticated;
