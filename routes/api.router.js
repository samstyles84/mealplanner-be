const apiRouter = require("express").Router();
const mealsRouter = require("./meals.router");
const ingredientsRouter = require("./ingredients.router");

const sendAPIs = require("../controllers/apis.controllers");
const checkUserExists = require("../controllers/users.controllers");

const { handle405s } = require("../errors");

apiRouter.use("/meals", mealsRouter);
apiRouter.route("/users/:username").get(checkUserExists).all(handle405s);

apiRouter.use("/ingredients", ingredientsRouter);

apiRouter.route("/").get(sendAPIs).all(handle405s);

module.exports = apiRouter;
