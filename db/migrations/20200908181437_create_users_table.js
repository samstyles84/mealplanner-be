exports.up = function (knex) {
  console.log("creating users table");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.increments("user_id");
    usersTable.string("username").unique().notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping users table");
  return knex.schema.dropTable("users");
};
