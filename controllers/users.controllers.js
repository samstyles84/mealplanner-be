const { checkUser } = require("../models/users.models");

const checkUserExists = (req, res, next) => {
  const { username } = req.params;
  checkUser(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = checkUserExists;
