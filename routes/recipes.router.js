const recipesRouter = require("express").Router();

const {
  sendIngredientUsage,
  sendRecipeUsage,
} = require("../controllers/ingredients.controllers");

const { handle405s } = require("../errors");

recipesRouter.route("/").get(sendIngredientUsage).all(handle405s);

recipesRouter.route("/:ingredient_id").get(sendRecipeUsage).all(handle405s);

module.exports = recipesRouter;
