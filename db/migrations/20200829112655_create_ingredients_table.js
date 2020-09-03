exports.up = function (knex) {
  console.log("creating ingredients table");
  return knex.schema.createTable("ingredients", (ingredientsTable) => {
    ingredientsTable.increments("ingredient_id");
    ingredientsTable.string("name").unique().notNullable();
    ingredientsTable.string("type").notNullable();
    ingredientsTable.string("units").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping ingredients table");
  return knex.schema.dropTable("ingredients");
};
