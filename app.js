const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config");

const cloudinary = require("cloudinary");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handle404s,
  handle500s,
} = require("./errors");

require("dotenv").config();

console.log("in app");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// app.use(cors());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handle404s);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
