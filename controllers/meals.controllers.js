const {
  fetchMealInfo,
  fetchMealById,
  postMeal,
  patchMeal,
  deleteMeal,
  patchVotes,
  postImage,
} = require("../models/meals.models");

const { postRecipe, deleteRecipe } = require("../models/recipes.models");

const sendMeals = (req, res, next) => {
  fetchMealInfo()
    .then((meals) => {
      res.status(200).send({ meals });
    })
    .catch((err) => {
      next(err);
    });
};

const sendMealbyId = (req, res, next) => {
  const { meal_id } = req.params;
  fetchMealById(meal_id)
    .then((meal) => {
      res.status(200).send({ meal });
    })
    .catch((err) => {
      next(err);
    });
};

const addMeal = (req, res, next) => {
  const { name, portions, recipe, votes, source } = req.body;
  //...
  postMeal(name, portions, votes, source)
    .then((mealRow) => {
      postRecipe(mealRow[0].meal_id, recipe).then((recipemapping) => {
        fetchMealById(recipemapping[0].meal_id).then((meal) => {
          res.status(201).send({ meal });
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const updateMeal = (req, res, next) => {
  const { name, portions, recipe, votes, source } = req.body;
  const { meal_id } = req.params;

  patchMeal(meal_id, name, portions, votes, source)
    .then((mealRow) => {
      deleteRecipe(meal_id).then((deletedRows) => {
        postRecipe(meal_id, recipe).then((recipemapping) => {
          fetchMealById(meal_id).then((meal) => {
            res.status(201).send({ meal });
          });
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const addImage = (req, res, next) => {
  const values = Object.values(req.files);
  const { meal_id } = req.params;

  postImage(meal_id, values)
    .then((meal) => {
      res.status(201).send({ meal });
    })
    .catch((err) => {
      next(err);
    });
};

const updateVotes = (req, res, next) => {
  const { votes } = req.body;
  const { meal_id } = req.params;
  patchVotes(meal_id, votes)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      next(err);
    });
};

const removeMeal = (req, res, next) => {
  const { meal_id } = req.params;
  deleteMeal(meal_id)
    .then((deletedMeal) => {
      if (deletedMeal) {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  sendMeals,
  sendMealbyId,
  addMeal,
  updateMeal,
  removeMeal,
  updateVotes,
  addImage,
};
