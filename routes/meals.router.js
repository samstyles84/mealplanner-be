const mealsRouter = require("express").Router();
const ingredientsRouter = require("./ingredients.router");

const {
  sendMeals,
  sendMealbyId,
  addMeal,
  updateMeal,
  removeMeal,
  updateVotes,
  addImage,
} = require("../controllers/meals.controllers");

const { handle405s } = require("../errors");

mealsRouter.route("/").get(sendMeals).post(addMeal).all(handle405s);

mealsRouter
  .route("/:meal_id")
  .get(sendMealbyId)
  .patch(updateMeal)
  .delete(removeMeal)
  .post(addImage)
  .all(handle405s);

mealsRouter.route("/:meal_id/votes").patch(updateVotes).all(handle405s);

mealsRouter.use("/ingredients", ingredientsRouter).all(handle405s);

module.exports = mealsRouter;
