exports.up = function (knex) {
  console.log("creating recipe mapping table");
  return knex.schema.createTable("recipemapping", (recipeMapping) => {
    recipeMapping
      .integer("meal_id")
      .references("meals.meal_id")
      .onDelete("CASCADE");
    recipeMapping
      .integer("ingredient_id")
      .references("ingredients.ingredient_id")
      .onDelete("CASCADE");
    recipeMapping.integer("quantity");
  });
};

exports.down = function (knex) {
  console.log("dropping meals table");
  return knex.schema.dropTable("recipemapping");
};
