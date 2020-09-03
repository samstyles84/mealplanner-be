const mealsRouter = require("express").Router();
const {
  sendMeals,
  sendMealbyId,
  addMeal,
  updateMeal,
} = require("../controllers/meals.controllers");
const ingredientsRouter = require("./ingredients.router");

//const { handle405s } = require("../errors");

mealsRouter.route("/").get(sendMeals).post(addMeal);
//.all(handle405s);
mealsRouter.route("/:meal_id").get(sendMealbyId).patch(updateMeal);
mealsRouter.use("/ingredients", ingredientsRouter);
//.all(handle405s);

module.exports = mealsRouter;
