const knex = require("../connection");
const { fetchIngredientsByMealId } = require("./ingredients.models");

exports.fetchMeals = (meal_id) => {
  return knex
    .select()
    .from("meals")
    .returning("*")
    .modify((query) => {
      if (meal_id) query.where("meal_id", meal_id);
    })
    .then((mealArray) => {
      return mealArray;
    });
};

exports.fetchMealById = (meal_id) => {
  return Promise.all([
    fetchIngredientsByMealId(meal_id),
    exports.fetchMeals(meal_id),
  ]).then((promiseArray) => {
    const mealObj = {};
    promiseArray.forEach((promise) => {
      if (promise.hasOwnProperty("ingredients")) {
        mealObj.recipe = promise.ingredients;
      } else {
        mealObj.meal_id = promise[0].meal_id;
        mealObj.name = promise[0].name;
        mealObj.portions = promise[0].portions;
      }
    });
    return mealObj;
  });
};

exports.postMeal = (name, portions, recipe) => {
  const mealToInsert = { name: name, portions: portions };
  return knex("meals").insert(mealToInsert).returning("*");
};

exports.patchMeal = (meal_id, name, portions) => {
  return knex("meals")
    .where("meals.meal_id", meal_id)
    .update(
      {
        name: name,
        portions: portions,
      },
      ["meal_id", "name", "portions"]
    )
    .then((mealArray) => {
      if (mealArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "non-existant meal id!!!",
        });
      }
      return mealArray[0];
    });
};
