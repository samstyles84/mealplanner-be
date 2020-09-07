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
      return recipeRows;
    });
};

exports.deleteRecipe = (meal_id) => {
  return knex("recipemapping").where("recipemapping.meal_id", meal_id).del();
};

exports.checkIngredientUsed = (ingredient_id) => {
  return knex("recipemapping")
    .where("recipemapping.ingredient_id", ingredient_id)
    .returning("*")
    .then((recipeRows) => {
      if (recipeRows.length > 0) {
        return true;
      } else return false;
    });
};
