const { mealsData, ingredientsData } = require("../data/index.js");

const { formatMeals, getRecipes } = require("../utils/utils");

exports.seed = function (knex) {
  console.log("seeding");
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("ingredients")
        .insert(ingredientsData)
        .returning(["ingredient_id", "name"])
        .then((ingredientsRows) => {
          const formattedMeals = formatMeals(mealsData);

          return knex("meals")
            .insert(formattedMeals)
            .returning(["meal_id", "name"])
            .then((mealRows) => {
              const recipeTable = getRecipes(
                mealsData,
                mealRows,
                ingredientsRows
              );
              return knex("recipemapping").insert(recipeTable);
            });
        });
    });
};
