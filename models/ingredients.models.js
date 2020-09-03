const knex = require("../connection");

exports.fetchIngredientsByMealId = (meal_id) => {
  return knex
    .select("*")
    .from("ingredients")
    .leftJoin(
      "recipemapping",
      "ingredients.ingredient_id",
      "recipemapping.ingredient_id"
    )
    .where("recipemapping.meal_id", meal_id)
    .then((ingredients) => {
      return { ingredients };
    });
};

exports.fetchAllIngredients = (sort_by = "name", order = "asc") => {
  return knex.select("*").from("ingredients").orderBy(sort_by, order);
};

exports.fetchIngredient = (ingredient_id) => {
  return knex
    .select("*")
    .from("ingredients")
    .where("ingredients.ingredient_id", ingredient_id)
    .then((array) => {
      return array[0];
    });
};

exports.postIngredient = (name, type, units) => {
  const ingredientToInsert = {
    name: name,
    type: type,
    units: units,
  };

  return knex("ingredients")
    .insert(ingredientToInsert)
    .returning("*")
    .then((ingredientToInsert) => {
      return ingredientToInsert[0];
    });
};

exports.patchIngredient = (name, type, units, ingredient_id) => {
  return knex("ingredients")
    .from("ingredients")
    .where("ingredients.ingredient_id", ingredient_id)
    .update(
      {
        name: name,
        type: type,
        units: units,
      },
      ["name", "type", "units", "ingredient_id"]
    )
    .then((ingredientArray) => {
      if (ingredientArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "non-existant comment id!!!",
        });
      }
      return ingredientArray[0];
    });
};

exports.deleteIngredient = (ingredient_id) => {
  console.log("in model", ingredient_id);
  return knex("ingredients")
    .where("ingredients.ingredient_id", ingredient_id)
    .del();
};
