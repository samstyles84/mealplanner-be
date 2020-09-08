const knex = require("../connection");

exports.checkUser = (username) => {
  return knex("users")
    .where("users.username", username)
    .returning("*")
    .then((userRows) => {
      if (userRows.length > 0) {
        return true;
      } else return false;
    });
};
