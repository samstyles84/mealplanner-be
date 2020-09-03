const ingredientsRouter = require("express").Router();
const {
  sendIngredientsByMealId,
  sendAllIngredients,
  addIngredient,
  sendIngredientById,
  updateIngredient,
  removeIngredient,
} = require("../controllers/ingredients.controllers");

ingredientsRouter.route("/").get(sendAllIngredients).post(addIngredient);
ingredientsRouter.route("/meal/:meal_id").get(sendIngredientsByMealId);
ingredientsRouter
  .route("/:ingredient_id")
  .get(sendIngredientById)
  .patch(updateIngredient)
  .delete(removeIngredient);

module.exports = ingredientsRouter;
