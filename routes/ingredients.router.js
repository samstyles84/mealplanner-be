const ingredientsRouter = require("express").Router();
const {
  sendIngredientsByMealId,
  sendAllIngredients,
  addIngredient,
  sendIngredientById,
  updateIngredient,
  removeIngredient,
  sendShoppingList,
} = require("../controllers/ingredients.controllers");

const recipesRouter = require("./recipes.router");

const { handle405s } = require("../errors");

console.log("in router");

ingredientsRouter
  .route("/")
  .get(sendAllIngredients)
  .post(addIngredient)
  .all(handle405s);

ingredientsRouter
  .route("/meal/:meal_id")
  .get(sendIngredientsByMealId)
  .all(handle405s);

ingredientsRouter.route("/shoppinglist").get(sendShoppingList).all(handle405s);

ingredientsRouter.use("/recipes", recipesRouter);

ingredientsRouter
  .route("/:ingredient_id")
  .get(sendIngredientById)
  .patch(updateIngredient)
  .delete(removeIngredient)
  .all(handle405s);

module.exports = ingredientsRouter;
