const knex = require("../connection");

const { checkIngredientUsed } = require("./recipes.models");

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
      if (ingredients.length === 0) {
        return Promise.reject({ status: 404, msg: "meal id not found" });
      } else {
        return { ingredients };
      }
    });
};

exports.fetchIngredientsForMealIDs = (meal_ids) => {
  return knex
    .select(
      "ingredients.ingredient_id",
      "ingredients.name",
      "ingredients.type",
      "ingredients.units"
    )
    .sum("recipemapping.quantity as quantity")
    .from("ingredients")
    .leftJoin(
      "recipemapping",
      "ingredients.ingredient_id",
      "recipemapping.ingredient_id"
    )
    .whereIn("recipemapping.meal_id", meal_ids)
    .groupBy(
      "ingredients.ingredient_id",
      "ingredients.name",
      "ingredients.type",
      "ingredients.units",
      "recipemapping.quantity"
    )
    .orderBy("ingredients.ingredient_id");
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
      if (array.length === 0) {
        return Promise.reject({ status: 404, msg: "ingredient id not found" });
      } else {
        return array[0];
      }
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
          msg: "ingredient id not found",
        });
      }
      return ingredientArray[0];
    });
};

exports.deleteIngredient = (ingredient_id) => {
  return checkIngredientUsed(ingredient_id).then((isUsed) => {
    if (!isUsed) {
      return knex("ingredients")
        .where("ingredients.ingredient_id", ingredient_id)
        .del()
        .then((deletedItems) => {
          if (deletedItems === 0) {
            return Promise.reject({
              status: 404,
              msg: "ingredient id not found",
            });
          } else {
            return deletedItems;
          }
        });
    } else {
      return Promise.reject({
        status: 404,
        msg: "Ingredient is referenced by a meal - delete meals first!!!",
      });
    }
  });
};
