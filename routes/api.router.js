const apiRouter = require("express").Router();
// const topicsRouter = require("./topics.router");
// const articlesRouter = require("./articles.router");
// const commentsRouter = require("./comments.router");
const mealsRouter = require("./meals.router");
const ingredientsRouter = require("./ingredients.router");

// const sendAPIs = require("../controllers/apis.controllers");
// const { handle405s } = require("../errors");

// apiRouter.use("/topics", topicsRouter);
// apiRouter.use("/articles", articlesRouter);
// apiRouter.use("/comments", commentsRouter);
apiRouter.use("/meals", mealsRouter);
apiRouter.use("/ingredients", ingredientsRouter);

// apiRouter.route("/").get(sendAPIs).all(handle405s);

module.exports = apiRouter;
