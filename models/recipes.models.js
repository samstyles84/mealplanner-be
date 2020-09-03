const knex = require("../connection");

exports.postRecipe = (meal_id, recipeArr) => {
  const recipeRowsToInsert = recipeArr.map((recipeRow) => {
    return {
      meal_id: meal_id,
      ingredient_id: recipeRow.ingredient_id,
      quantity: recipeRow.quantity,
    };
  });

  return knex("recipemapping")
    .insert(recipeRowsToInsert)
    .returning("*")
    .then((recipeRows) => {
      console.log(recipeRows, "recipemodel");
      return recipeRows;
    });
};

exports.deleteRecipe = (meal_id) => {
  return knex("recipemapping").where("recipemapping.meal_id", meal_id).del();
};
