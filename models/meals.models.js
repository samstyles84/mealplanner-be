const knex = require("../connection");
const cloudinary = require("cloudinary");

const { fetchIngredientsByMealId } = require("./ingredients.models");

exports.fetchMealInfo = (meal_id) => {
  return knex
    .select()
    .from("meals")
    .returning("*")
    .modify((query) => {
      if (meal_id) query.where("meal_id", meal_id);
    })
    .then((mealArray) => {
      if (mealArray.length === 0) {
        return Promise.reject({ status: 404, msg: "meal id not found" });
      } else {
        return mealArray;
      }
    });
};

exports.fetchMealInfoForMealIDs = (mealsArray) => {
  return knex
    .select()
    .from("meals")
    .returning("*")
    .whereIn("meal_id", mealsArray)
    .then((mealArray) => {
      if (mealArray.length === 0) {
        return Promise.reject({ status: 404, msg: "meal id not found" });
      } else {
        return mealArray;
      }
    });
};

exports.fetchMealById = (meal_id) => {
  return Promise.all([
    fetchIngredientsByMealId(meal_id),
    exports.fetchMealInfo(meal_id),
  ]).then((promiseArray) => {
    const mealObj = {};
    promiseArray.forEach((promise) => {
      if (promise.hasOwnProperty("ingredients")) {
        mealObj.recipe = promise.ingredients;
      } else {
        mealObj.meal_id = promise[0].meal_id;
        mealObj.name = promise[0].name;
        mealObj.portions = promise[0].portions;
        mealObj.votes = promise[0].votes;
        mealObj.source = promise[0].source;
        mealObj.imgURL = promise[0].imgURL;
      }
    });
    return mealObj;
  });
};

exports.postMeal = (name, portions, votes, source, imgURL) => {
  const mealToInsert = {
    name: name,
    portions: portions,
    votes: votes,
    source: source,
    imgURL: imgURL,
  };
  return knex("meals").insert(mealToInsert).returning("*");
};

exports.patchMeal = (meal_id, name, portions, votes, source, imgURL) => {
  return knex("meals")
    .where("meals.meal_id", meal_id)
    .increment({
      votes: votes,
    })
    .update(
      {
        name: name,
        portions: portions,
        source: source,
        imgURL: imgURL,
      },
      ["meal_id", "name", "portions", "votes", "source", "imgURL"]
    )
    .then((mealArray) => {
      if (mealArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "meal id not found",
        });
      }
      return mealArray[0];
    });
};

exports.patchVotes = (meal_id, votes) => {
  return knex("meals")
    .where("meals.meal_id", meal_id)
    .increment({
      votes: votes,
    })
    .then((mealArray) => {
      if (mealArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "meal id not found",
        });
      }
      return mealArray[0];
    });
};

exports.deleteMeal = (meal_id) => {
  return knex("meals")
    .where("meals.meal_id", meal_id)
    .then((meal) => {
      if (meal.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "meal id not found",
        });
      } else {
        return knex("meals").where("meals.meal_id", meal_id).del();
      }
    });
};

exports.postImage = (meal_id, values) => {
  const promises = values.map((image) =>
    cloudinary.uploader.upload(image.path)
  );
  return Promise.all(promises).then((uploadedFiles) => {
    exports.patchImage(meal_id, uploadedFiles[0].url).then((response) => {
      console.log(response);
      return response[0];
    });
  });
};

exports.patchImage = (meal_id, imgURL) => {
  return knex("meals")
    .where("meals.meal_id", meal_id)
    .update({
      imgURL: imgURL,
    })
    .then((mealArray) => {
      if (mealArray.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "meal id not found",
        });
      }
      return mealArray[0];
    });
};
