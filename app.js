const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config");
const ENV = process.env.NODE_ENV || "development";

const cloudinary = require("cloudinary");
const formData = require("express-form-data");

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

// if (ENV !== "test") {
//   // Set up a whitelist and check against it:
//   var whitelist = [
//     "https://react-image-upload.surge.sh",
//     "http://localhost:3000",
//     "http://localhost:9090",
//   ];
//   var corsOptions = {
//     origin: function (origin, callback) {
//       console.log(origin, "origin");
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS", origin));
//       }
//     },
//   };
//   // Then pass them to cors:
//   app.use(cors(corsOptions));
// }

app.use(cors());

// app.all("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

app.use(express.json());

app.use(formData.parse());

app.use("/api", apiRouter);

app.all("*", handle404s);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
