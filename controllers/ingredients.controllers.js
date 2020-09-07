const {
  fetchIngredientsByMealId,
  fetchAllIngredients,
  postIngredient,
  fetchIngredient,
  patchIngredient,
  deleteIngredient,
  fetchIngredientsForMealIDs,
} = require("../models/ingredients.models");

const { fetchMealInfoForMealIDs } = require("../models/meals.models");

const sendIngredientsByMealId = (req, res, next) => {
  const { meal_id } = req.params;
  fetchIngredientsByMealId(meal_id)
    .then((ingredients) => {
      res.status(200).send(ingredients);
    })
    .catch((err) => {
      next(err);
    });
};

const sendIngredientById = (req, res, next) => {
  const { ingredient_id } = req.params;
  fetchIngredient(ingredient_id)
    .then((ingredients) => {
      res.status(200).send({ ingredients });
    })
    .catch((err) => {
      next(err);
    });
};

const sendAllIngredients = (req, res, next) => {
  fetchAllIngredients()
    .then((ingredients) => {
      res.status(200).send({ ingredients });
    })
    .catch((err) => {
      next(err);
    });
};

const addIngredient = (req, res, next) => {
  const { name, type, units } = req.body;

  postIngredient(name, type, units)
    .then((ingredient) => {
      res.status(201).send({ ingredient });
    })
    .catch((err) => {
      next(err);
    });
};

const updateIngredient = (req, res, next) => {
  const { name, type, units } = req.body;
  const { ingredient_id } = req.params;

  patchIngredient(name, type, units, ingredient_id)
    .then((ingredient) => {
      res.status(200).send({ ingredient });
    })
    .catch((err) => {
      next(err);
    });
};

const removeIngredient = (req, res, next) => {
  const { ingredient_id } = req.params;

  deleteIngredient(ingredient_id)
    .then((deletedIngredients) => {
      if (deletedIngredients) {
        res.sendStatus(204);
      } else {
      }
    })
    .catch((err) => {
      next(err);
    });
};

const sendShoppingList = (req, res, next) => {
  const { meals } = req.query;
  const mealsArray = meals.split(",");

  Promise.all([
    fetchMealInfoForMealIDs(mealsArray),
    fetchIngredientsForMealIDs(mealsArray),
  ])
    .then((promiseArr) => {
      const mealArr = promiseArr[0];
      const ingredientsArr = promiseArr[1];

      let portions = 0;
      const meal_ids = [];
      const meal_names = [];

      mealArr.forEach((meal) => {
        portions += meal.portions;
        meal_ids.push(meal.meal_id);
        meal_names.push(meal.name);
      });

      const shoppinglist = {
        ingredients: ingredientsArr,
        meal_ids: meal_ids,
        meal_names: meal_names,
        portions: portions,
      };
      res.status(200).send({ shoppinglist });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  sendIngredientsByMealId,
  sendAllIngredients,
  addIngredient,
  sendIngredientById,
  updateIngredient,
  removeIngredient,
  sendShoppingList,
};
