const mealsRouter = require("express").Router();
const ingredientsRouter = require("./ingredients.router");

const {
  sendMeals,
  sendMealbyId,
  addMeal,
  updateMeal,
  removeMeal,
} = require("../controllers/meals.controllers");

const { handle405s } = require("../errors");

mealsRouter.route("/").get(sendMeals).post(addMeal).all(handle405s);

mealsRouter
  .route("/:meal_id")
  .get(sendMealbyId)
  .patch(updateMeal)
  .delete(removeMeal)
  .all(handle405s);

mealsRouter.use("/ingredients", ingredientsRouter).all(handle405s);

module.exports = mealsRouter;
